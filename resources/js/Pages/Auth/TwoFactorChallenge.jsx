import { useForm } from '@inertiajs/react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TwoFactorChallenge() {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
    });

    function submit(e) {
        e.preventDefault();
        post('/two-factor-challenge');
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl text-center">Two Factor Authentication</CardTitle>
                    <CardDescription className="text-center">
                        Please enter the code from your authenticator app to continue.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="code">
                                Authentication Code
                            </label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value)}
                                required
                                maxLength={6}
                            />
                            {errors.code && <p className="text-destructive text-sm">{errors.code}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={processing}
                        >
                            {processing ? 'Verifying...' : 'Verify'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

/** ⛔ Override Layout to REMOVE NAVBAR */
TwoFactorChallenge.layout = (page) => page;
