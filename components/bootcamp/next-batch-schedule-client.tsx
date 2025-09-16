'use client'

import { Button } from '@/components/ui/button'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { StrapiIcon } from '@/types/shared-types'
import { isAuthenticated } from '@/lib/auth'

interface ButtonData {
  btnIcon?: StrapiIcon
  btnLabel?: string
}

interface BatchScheduleClientProps {
  buttonData?: ButtonData
}

export const BatchScheduleClient: React.FC<BatchScheduleClientProps> = ({
  buttonData,
}) => {
  const router = useRouter()

  const handleRegisterClick = async () => {
    const isUserAuthenticated = await isAuthenticated()
    // Add registration logic here
    if (!isUserAuthenticated) {
      router.push('/register')
      // Example: Show toast notification
      toast.success('Redirecting to registration...', {
        description: 'You will be redirected to the registration form',
      })
    } else {
      router.push('/dashboard')
      toast.info('you already registered. Redirecting to dashboard...', {
        description: 'You will be redirected to your dashboard',
      })
    }

    // Example: Navigate to registration page
    // router.push('/register')

    // Example: Open registration modal
    // setShowRegistrationModal(true)

    // Example: Track analytics
    // analytics.track('Registration Button Clicked', {
    //   source: 'batch_schedule',
    //   batch_number: data.batchNumber
    // })
  }

  return (
    <Button
      size="lg"
      className="rounded-full text-base"
      onClick={handleRegisterClick}
    >
      {buttonData?.btnIcon && (
        <DynamicIcon
          icon={buttonData.btnIcon}
          className="w-4 h-4 mr-2"
          width={16}
          height={16}
        />
      )}
      {buttonData?.btnLabel || 'Register Now'}
    </Button>
  )
}
