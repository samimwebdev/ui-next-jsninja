'use client'

import { Button } from '@/components/ui/button'
import DynamicIcon from '@/components/shared/DynamicIcon'
import { StrapiIcon } from '@/types/shared-types'

interface PricingPackageData {
  id: number
  name: string
  isPreferred?: boolean | null
  btn?: {
    id: number
    btnIcon?: StrapiIcon
    btnLabel?: string
    btnLink?: string | null
  }
}

interface PricingClientWrapperProps {
  packageData: PricingPackageData
}

export const PricingClientWrapper: React.FC<PricingClientWrapperProps> = ({
  packageData,
}) => {
  const handleEnrollClick = () => {
    // Add analytics tracking, form submission, or redirect logic here
    console.log(`Enrolling in package: ${packageData.name}`)
    // Example: router.push('/checkout?package=' + packageData.id)
  }

  return (
    <Button
      size="lg"
      className="w-full"
      variant={packageData.isPreferred ? 'default' : 'outline'}
      onClick={handleEnrollClick}
    >
      {packageData.btn?.btnIcon && (
        <DynamicIcon
          icon={packageData.btn.btnIcon}
          className="mr-2 h-4 w-4"
          width={16}
          height={16}
        />
      )}
      {packageData.btn?.btnLabel || `Enroll Now - ${packageData.name}`}
    </Button>
  )
}
