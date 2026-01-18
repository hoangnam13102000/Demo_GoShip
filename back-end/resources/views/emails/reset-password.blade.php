<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - GoShip</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #ffffff;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 30px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .header h1 {
            color: white;
            margin: 0;
            font-size: 24px;
        }
        .content {
            padding: 40px;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 14px 32px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 25px;
            font-weight: bold;
            margin: 25px 0;
            transition: all 0.3s ease;
        }
        .button:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .info-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 15px;
            margin: 20px 0;
            text-align: left;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eaeaea;
            font-size: 12px;
            color: #666;
            text-align: center;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #667eea;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">GoShip</div>
            <h1>Đặt Lại Mật Khẩu</h1>
        </div>
        
        <div class="content">
            <h2>Xin chào!</h2>
            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản GoShip của bạn.</p>
            
            <p>Vui lòng nhấp vào nút bên dưới để đặt lại mật khẩu:</p>
            
            <a href="{{ $resetLink }}" class="button">Đặt Lại Mật Khẩu</a>
            
            <p>Nếu nút trên không hoạt động, bạn có thể sao chép và dán đường link sau vào trình duyệt:</p>
            <p style="word-break: break-all; color: #667eea;">{{ $resetLink }}</p>
            
            <div class="info-box">
                <strong> Lưu ý quan trọng:</strong>
                <ul>
                    <li>Liên kết này sẽ hết hạn sau {{ $expiresIn }}</li>
                    <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                    <li>Liên kết chỉ có thể sử dụng một lần</li>
                </ul>
            </div>
            
            <p>Nếu bạn gặp bất kỳ vấn đề nào, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.</p>
        </div>
        
        <div class="footer">
            <p>© {{ date('Y') }} GoShip. All rights reserved.</p>
            <p>Đây là email tự động, vui lòng không trả lời email này.</p>
            <p>Để được hỗ trợ, vui lòng liên hệ: support@goship.com</p>
        </div>
    </div>
</body>
</html>