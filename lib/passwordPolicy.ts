export type PasswordRequirement = {
  id: string;
  label: string;
  test: (value: string) => boolean;
};

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (value: string) => value.length >= 8,
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    id: 'number',
    label: 'One number',
    test: (value: string) => /\d/.test(value),
  },
  {
    id: 'special',
    label: 'One special character',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
];

export function getUnmetPasswordRequirements(password: string): PasswordRequirement[] {
  return PASSWORD_REQUIREMENTS.filter((requirement) => !requirement.test(password));
}

export function getPasswordStrengthMeta(password: string) {
  if (!password) {
    return {
      label: '',
      percent: 0,
      score: 0,
      color: 'bg-gray-200',
    };
  }

  const score = PASSWORD_REQUIREMENTS.filter((requirement) => requirement.test(password)).length;
  const percent = Math.min(100, (score / PASSWORD_REQUIREMENTS.length) * 100);

  let label = 'Weak';
  let color = 'bg-red-500';
  if (score <= 2) {
    label = 'Weak';
    color = 'bg-red-500';
  } else if (score === 3) {
    label = 'Fair';
    color = 'bg-orange-500';
  } else if (score === 4) {
    label = 'Good';
    color = 'bg-yellow-500';
  } else {
    label = 'Strong';
    color = 'bg-green-500';
  }

  return {
    label,
    percent,
    score,
    color,
  };
}
