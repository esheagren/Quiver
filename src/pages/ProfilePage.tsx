import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { useUserToken } from '@/hooks/useUserToken'
import { toast } from 'sonner'

const profileSchema = z.object({
  display_name: z.string().optional(),
  grade_levels: z.array(z.string()).optional(),
  subjects_taught: z.array(z.string()).optional(),
  bio: z.string().optional(),
})

type ProfileFormData = z.infer<typeof profileSchema>

const GRADE_LEVELS = ['K-2', '3-5', '6-8', '9-12', 'Higher Ed']
const SUBJECTS = [
  'Math',
  'Science',
  'ELA',
  'Social Studies',
  'Art',
  'Music',
  'PE',
  'Foreign Language',
  'Technology',
  'Other',
]

export default function ProfilePage() {
  const userToken = useUserToken()
  const [loading, setLoading] = useState(true)
  const [selectedGrades, setSelectedGrades] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    setValue,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  useEffect(() => {
    if (userToken) {
      loadProfile()
    }
  }, [userToken])

  const loadProfile = async () => {
    if (!userToken) return

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_token', userToken)
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        setValue('display_name', data.display_name || '')
        setValue('bio', data.bio || '')
        setSelectedGrades(data.grade_levels || [])
        setSelectedSubjects(data.subjects_taught || [])
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!userToken) return

    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_token: userToken,
          display_name: data.display_name || null,
          grade_levels: selectedGrades,
          subjects_taught: selectedSubjects,
          bio: data.bio || null,
        })

      if (error) throw error
      toast.success('Profile updated!')
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  const toggleGrade = (grade: string) => {
    setSelectedGrades((prev) =>
      prev.includes(grade) ? prev.filter((g) => g !== grade) : [...prev, grade]
    )
  }

  const toggleSubject = (subject: string) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    )
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-3xl font-bold">Profile</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="display_name">Display Name</Label>
          <Input
            id="display_name"
            placeholder="Ms. Johnson"
            {...register('display_name')}
          />
        </div>

        <div>
          <Label>Grade Levels</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {GRADE_LEVELS.map((grade) => (
              <Button
                key={grade}
                type="button"
                variant={selectedGrades.includes(grade) ? 'default' : 'outline'}
                onClick={() => toggleGrade(grade)}
              >
                {grade}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label>Subjects Taught</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUBJECTS.map((subject) => (
              <Button
                key={subject}
                type="button"
                variant={selectedSubjects.includes(subject) ? 'default' : 'outline'}
                onClick={() => toggleSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about yourself..."
            rows={4}
            {...register('bio')}
          />
        </div>

        <Button type="submit">Save Profile</Button>
      </form>
    </div>
  )
}

