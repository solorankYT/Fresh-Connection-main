import { useForm } from '@inertiajs/react';
import '@/resources/css/app.css';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-xl text-center">Log in to your account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password below to log in
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium" htmlFor="email">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-medium" htmlFor="password">
                                    Password
                                </label>
                                <a href="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground">
                                    Forgot password?
                                </a>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
                        </div>

                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked)}
                            />
                            <label htmlFor="remember" className="text-sm text-muted-foreground">
                                Remember me
                            </label>
                        </div>

                        <Button 
                            type="submit" 
                            className="w-full "
                            disabled={processing}
                        >
                            {processing ? 'Logging in...' : 'Log in'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p className="mx-auto text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <a href="/register" className="text-primary hover:text-primary/80">
                            Sign up
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}

/** ⛔ Override Layout to REMOVE NAVBAR */
Login.layout = (page) => page;