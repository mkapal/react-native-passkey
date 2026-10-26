interface PasskeyErrorTemplate {
  error: string;
  message: string;
}

export const UnknownError = {
  error: 'Unknown error',
  message: 'An unknown error occurred',
} as const satisfies PasskeyErrorTemplate;

export const NotSupportedError = {
  error: 'NotSupported',
  message:
    'Passkeys are not supported on this device. iOS 15 or Android SDK 28 and above is required to use Passkeys',
} as const satisfies PasskeyErrorTemplate;

export const RequestFailedError = {
  error: 'RequestFailed',
  message: 'The request failed. No Credentials were returned.',
} as const satisfies PasskeyErrorTemplate;

export const UserCancelledError = {
  error: 'UserCancelled',
  message: 'The user cancelled the request.',
} as const satisfies PasskeyErrorTemplate;

export const InvalidChallengeError = {
  error: 'InvalidChallenge',
  message: 'The provided challenge was invalid',
} as const satisfies PasskeyErrorTemplate;

export const InvalidUserIdError = {
  error: 'InvalidUserId',
  message: 'The provided userId was invalid',
} as const satisfies PasskeyErrorTemplate;

export const BadConfiguration = {
  error: 'BadConfiguration',
  message: 'Your app is not properly configured. Refer to the docs for help.',
} as const satisfies PasskeyErrorTemplate;

export const NoCredentialsError = {
  error: 'NoCredentials',
  message: 'No viable credential is available for the user.',
} as const satisfies PasskeyErrorTemplate;

export const InterruptedError = {
  error: 'Interrupted',
  message: 'The operation was interrupted and may be retried.',
} as const satisfies PasskeyErrorTemplate;

export const TimeoutError = {
  error: 'TimedOut',
  message: 'The operation timed out.',
} as const satisfies PasskeyErrorTemplate;

export const CredentialAlreadyExistsError = {
  error: 'CredentialAlreadyExists',
  message: 'A passkey for this account already exists on this device.',
} as const satisfies PasskeyErrorTemplate;

export const NoCreateOptionError = {
  error: 'NoCreateOption',
  message:
    'No credential provider is available to create a passkey on this device.',
} as const satisfies PasskeyErrorTemplate;

interface NativeError {
  error: 'Native error';
  message: string;
}

export type PasskeyError =
  | typeof UnknownError
  | typeof NotSupportedError
  | typeof RequestFailedError
  | typeof UserCancelledError
  | typeof InvalidChallengeError
  | typeof InvalidUserIdError
  | typeof BadConfiguration
  | typeof NoCredentialsError
  | typeof InterruptedError
  | typeof TimeoutError
  | typeof CredentialAlreadyExistsError
  | typeof NoCreateOptionError
  | NativeError;

export const NativeError = (
  message = 'An unknown error occurred'
): PasskeyError => {
  return {
    error: 'Native error',
    message: message,
  };
};

export interface TNativeError {
  code?: string;
  message?: string;
}

export function handleNativeError(_error: TNativeError): PasskeyError {
  if (!_error.code) {
    return UnknownError;
  }

  const mappedError = mapNativeErrorCode(_error.code, _error);

  // Preserve the native error message (e.g. "RP ID cannot be validated.")
  // when it carries more detail than the coarse error code, so callers can
  // diagnose configuration problems instead of only seeing the generic
  // fallback message for the mapped code.
  if (
    typeof _error.message === 'string' &&
    _error.message.length > 0 &&
    _error.message !== _error.code
  ) {
    return { ...mappedError, message: _error.message };
  }

  return mappedError;
}

function mapNativeErrorCode(code: string, _error: TNativeError): PasskeyError {
  switch (code) {
    case 'NotSupported': {
      return NotSupportedError;
    }
    case 'RequestFailed': {
      return RequestFailedError;
    }
    case 'UserCancelled': {
      return UserCancelledError;
    }
    case 'InvalidChallenge': {
      return InvalidChallengeError;
    }
    case 'BadConfiguration': {
      return BadConfiguration;
    }
    case 'Interrupted': {
      return InterruptedError;
    }
    case 'NoCredentials': {
      return NoCredentialsError;
    }
    case 'TimedOut': {
      return TimeoutError;
    }
    case 'CredentialAlreadyExists': {
      return CredentialAlreadyExistsError;
    }
    case 'NoCreateOption': {
      return NoCreateOptionError;
    }
    case 'UnknownError': {
      return UnknownError;
    }
    default: {
      return NativeError(String(_error));
    }
  }
}
