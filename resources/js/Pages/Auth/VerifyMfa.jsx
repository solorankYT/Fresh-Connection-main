import { useForm } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';

export default function VerifyMfa({ expiresAt, userEmail }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        verification_code: '',
    });
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [canResend, setCanResend] = useState(false);
    const [codeSent, setCodeSent] = useState(true);

    const submit = (e) => {
        e.preventDefault();
        router.post('/verify-mfa', data, {
            onSuccess: () => {
                reset('verification_code');
            },
        });
    };

    const resendCode = (e) => {
        e.preventDefault();
        router.post('/verify-mfa/send', {}, {
            onSuccess: () => {
                setTimeLeft(600);
                setCanResend(false);
                setCodeSent(true);
            }
        });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="p-8 bg-white rounded-lg shadow-md w-[480px]">
                <h1 className="text-2xl font-bold mb-2">Two-Factor Authentication</h1>
                <p className="text-gray-600 mb-6">
                    A verification code has been sent to {userEmail}
                </p>

                {codeSent && (
                    <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg flex items-center justify-between">
                        <div>
                            <p className="font-medium">Code validity</p>
                            <p className="text-sm">Time remaining: {formatTime(timeLeft)}</p>
                        </div>
                        {timeLeft === 0 && (
                            <p className="text-sm font-medium text-red-600">Code expired</p>
                        )}
                    </div>
                )}

                {errors.verification_code && (
                    <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                        {errors.verification_code}
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="mb-4">
                        <label htmlFor="verification_code" className="block text-sm font-medium mb-1">
                            Verification Code
                        </label>
                        <Input
                            id="verification_code"
                            type="text"
                            maxLength={6}
                            value={data.verification_code}
                            onChange={(e) => setData('verification_code', e.target.value)}
                            className="w-full"
                            placeholder="Enter 6-digit code"
                        />
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <Button
                            type="submit"
                            disabled={processing || timeLeft === 0}
                            className="w-32"
                        >
                            {processing ? 'Verifying...' : 'Verify'}
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            onClick={resendCode}
                            disabled={processing || !canResend}
                            className="w-32"
                        >
                            {processing ? 'Sending...' : 'Resend Code'}
                        </Button>
                    </div>
                </form>

                <div className="mt-6 text-sm text-gray-600">
                    <p>Didn't receive the code?</p>
                    <ul className="list-disc ml-5 mt-2">
                        <li>Check your spam folder</li>
                        <li>Verify your email address is correct</li>
                        <li>Wait a few minutes before requesting a new code</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}