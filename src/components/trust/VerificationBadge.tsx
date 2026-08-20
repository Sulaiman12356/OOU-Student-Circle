import React from 'react';
import { 
  CheckCircle2, 
  GraduationCap, 
  Sparkles, 
  Store, 
  Building2, 
  ShieldCheck,
  Info
} from 'lucide-react';
import { VerificationTier, VERIFICATION_TIERS } from '../../types/trustSafety';
import { TrustSafetyStore } from '../../services/trustSafetyStore';

interface VerificationBadgeProps {
  userId?: string;
  tier?: VerificationTier;
  // If directly passing verified status (must be strictly checked)
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  customLabel?: string;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  userId,
  tier = 'student',
  isVerified,
  size = 'md',
  showLabel = true,
  customLabel,
  className = ''
}) => {
  // STRICT RULE: Do not display verification badges unless verification has actually occurred!
  const hasVerified = isVerified !== undefined 
    ? Boolean(isVerified)
    : (userId ? TrustSafetyStore.isUserTierVerified(userId, tier as VerificationTier) : false);

  if (!hasVerified) {
    return null;
  }

  const tierInfo = VERIFICATION_TIERS[tier] || VERIFICATION_TIERS.student;
  const labelText = customLabel || tierInfo.badgeLabel;

  const renderIcon = () => {
    switch (tier) {
      case 'student':
        return <GraduationCap className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      case 'service_provider':
        return <Sparkles className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      case 'campus_shop':
        return <Store className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      case 'business':
        return <Building2 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
      default:
        return <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : size === 'lg' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />;
    }
  };

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-xs px-3 py-1.5 gap-2 font-black'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold border ${tierInfo.badgeBg} ${tierInfo.badgeText} ${tierInfo.badgeBorder} ${sizeClasses[size]} shadow-xs ${className}`}
      title={`${tierInfo.label}: ${tierInfo.description}`}
    >
      <span className="flex items-center justify-center">
        {renderIcon()}
      </span>
      {showLabel && (
        <span className="tracking-tight whitespace-nowrap">
          {labelText}
        </span>
      )}
      <CheckCircle2 className={`${size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'} text-emerald-600 fill-emerald-100 ml-0.5`} />
    </span>
  );
};
