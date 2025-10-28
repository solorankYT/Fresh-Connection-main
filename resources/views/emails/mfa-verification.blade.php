<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Security Verification Code</title>
</head>
<body style="margin:0; padding:0; font-family: Arial, Helvetica, sans-serif; background-color:#f4f4f7;">

    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:20px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 10px rgba(0,0,0,0.1);">

                    <!-- Header -->
                    <tr>
                        <td style="background:#FF9800; padding:20px; text-align:center; color:#ffffff;">
                            <h1 style="margin:0; font-size:24px;">Security Verification Required</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:30px;">
                            <h2 style="margin-top:0; color:#333;">Verification Code</h2>
                            
                            <div style="background-color:#f8f9fa; border-radius:4px; padding:20px; text-align:center; margin:20px 0;">
                                <span style="font-size:32px; letter-spacing:8px; font-weight:bold; color:#FF9800;">{{ $code }}</span>
                            </div>

                            <p style="color:#555; font-size:15px;">
                                For your security, we require verification of your login attempt. Please use the code above to complete your login.
                            </p>

                            <div style="background-color:#fff3e0; border-left:4px solid #FF9800; padding:15px; margin:20px 0;">
                                <p style="margin:0; color:#e65100;">
                                    <strong>Important:</strong>
                                </p>
                                <ul style="margin:10px 0; padding-left:20px; color:#666;">
                                    <li>This code will expire in 5 minutes</li>
                                    <li>Never share this code with anyone</li>
                                    <li>Our team will never ask for this code</li>
                                </ul>
                            </div>

                            <table cellpadding="8" cellspacing="0" width="100%" style="border-collapse:collapse; margin:20px 0; font-size:14px;">
                                <tr style="background:#f9f9f9;">
                                    <td style="width:150px; font-weight:bold;">Login Attempt From:</td>
                                    <td>{{ $browser }}</td>
                                </tr>
                                <tr>
                                    <td style="font-weight:bold;">IP Address:</td>
                                    <td>{{ $ipAddress }}</td>
                                </tr>
                                <tr style="background:#f9f9f9;">
                                    <td style="font-weight:bold;">Time:</td>
                                    <td>{{ $timestamp }}</td>
                                </tr>
                            </table>

                            <p style="color:#666; font-size:14px;">
                                If you did not attempt to log in, please secure your account by changing your password immediately.
                            </p>

                            <p style="margin-top:30px; color:#333;">
                                Thank you,<br>
                                <strong>Security Team</strong>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background:#f4f4f7; text-align:center; padding:15px; font-size:12px; color:#888;">
                            &copy; {{ date('Y') }} Fresh Connection. All rights reserved.
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>