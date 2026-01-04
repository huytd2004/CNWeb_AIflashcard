const HTML_TEMPLATE = (user, code, message, detail) => {
    return `
    <!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>My Flashcard - Xác thực tài khoản</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                margin: 0;
                width: 100%;
            }
            .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 30px;
                text-align: center;
            }
            .logo-container {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 50%;
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
            }
            .logo-icon {
                font-size: 48px;
            }
            .app-name {
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 1px;
                margin: 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .app-tagline {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                margin-top: 8px;
            }
            .content {
                padding: 40px 30px;
            }
            .greeting {
                font-size: 24px;
                color: #2d3748;
                font-weight: 600;
                margin-bottom: 16px;
                text-align: center;
            }
            .message {
                font-size: 16px;
                color: #4a5568;
                text-align: center;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .otp-container {
                background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
                border: 2px dashed #667eea;
                border-radius: 12px;
                padding: 30px;
                margin: 30px 0;
                text-align: center;
            }
            .otp-label {
                font-size: 14px;
                color: #718096;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
                font-weight: 600;
            }
            .otp-code {
                font-size: 36px;
                font-weight: 700;
                color: #667eea;
                letter-spacing: 8px;
                font-family: 'Courier New', monospace;
            }
            .detail-text {
                font-size: 14px;
                color: #718096;
                text-align: center;
                margin-top: 24px;
                line-height: 1.6;
                padding: 16px;
                background: #f7fafc;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }
            .security-notice {
                background: #fff5f5;
                border: 1px solid #feb2b2;
                border-radius: 8px;
                padding: 16px;
                margin-top: 24px;
            }
            .security-icon {
                color: #f56565;
                font-size: 20px;
                margin-bottom: 8px;
            }
            .security-text {
                font-size: 13px;
                color: #c53030;
                line-height: 1.5;
            }
            .footer {
                background: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                font-size: 13px;
                color: #718096;
                line-height: 1.6;
                margin-bottom: 16px;
            }
            .footer-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }
            .footer-link:hover {
                text-decoration: underline;
            }
            .social-links {
                margin-top: 20px;
                display: flex;
                justify-content: center;
                gap: 16px;
            }
            .social-link {
                display: inline-block;
                width: 36px;
                height: 36px;
                line-height: 36px;
                border-radius: 50%;
                background: #667eea;
                color: #ffffff;
                text-decoration: none;
                font-size: 18px;
            }
            @media (max-width: 600px) {
                body {
                    padding: 20px 10px;
                }
                .header {
                    padding: 30px 20px;
                }
                .content {
                    padding: 30px 20px;
                }
                .otp-code {
                    font-size: 28px;
                    letter-spacing: 4px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <div class="logo-container">
                    <div class="logo-icon">📚</div>
                </div>
                <h1 class="app-name">MY FLASHCARD</h1>
                <p class="app-tagline">Học tập thông minh, ghi nhớ hiệu quả</p>
            </div>
            
            <div class="content">
                <h2 class="greeting">Xin chào, ${user}! 👋</h2>
                <p class="message">${message}</p>
                
                <div class="otp-container">
                    <div class="otp-label">${message}</div>
                    <div class="otp-code">${code}</div>
                </div>
                
                <div class="detail-text">
                    ${detail}
                </div>
                
                <div class="security-notice">
                    <div class="security-icon">🔒</div>
                    <div class="security-text">
                        <strong>Lưu ý bảo mật:</strong> Không chia sẻ mã này với bất kỳ ai. 
                        Đội ngũ My Flashcard sẽ không bao giờ yêu cầu mã xác thực của bạn.
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    Cần hỗ trợ? Liên hệ với chúng tôi tại 
                    <a href="mailto:khanhbk0102@gmail.com" class="footer-link">khanhbk0102@gmail.com</a>
                </p>
                <p class="footer-text">
                    © 2025 My Flashcard. All rights reserved.
                </p>
            </div>
        </div>
    </body>
</html>`;
};

const CONTRIBUTE_HTML = (user, content) => {
    return `
<!DOCTYPE html>
<html lang="vi">
    <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Cảm ơn đóng góp của bạn</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px 20px;
                margin: 0;
                width: 100%;
            }
            .email-wrapper {
                max-width: 600px;
                margin: 0 auto;
                background: #ffffff;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            .header {
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                padding: 40px 30px;
                text-align: center;
            }
            .logo-container {
                display: inline-block;
                background: rgba(255, 255, 255, 0.2);
                padding: 20px;
                border-radius: 50%;
                margin-bottom: 20px;
                backdrop-filter: blur(10px);
            }
            .logo-icon {
                font-size: 48px;
            }
            .app-name {
                color: #ffffff;
                font-size: 32px;
                font-weight: 700;
                letter-spacing: 1px;
                margin: 0;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }
            .app-tagline {
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                margin-top: 8px;
            }
            .content {
                padding: 40px 30px;
            }
            .thank-you-icon {
                text-align: center;
                font-size: 64px;
                margin-bottom: 20px;
            }
            .greeting {
                font-size: 24px;
                color: #2d3748;
                font-weight: 600;
                margin-bottom: 16px;
                text-align: center;
            }
            .message {
                font-size: 16px;
                color: #4a5568;
                text-align: center;
                margin-bottom: 30px;
                line-height: 1.6;
            }
            .content-box {
                background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
                border: 2px solid #10b981;
                border-radius: 12px;
                padding: 24px;
                margin: 30px 0;
            }
            .content-label {
                font-size: 14px;
                color: #065f46;
                text-transform: uppercase;
                letter-spacing: 1px;
                margin-bottom: 12px;
                font-weight: 600;
                text-align: center;
            }
            .content-text {
                font-size: 15px;
                color: #047857;
                line-height: 1.8;
                text-align: left;
                white-space: pre-wrap;
                word-wrap: break-word;
            }
            .appreciation-box {
                background: #fef3c7;
                border-left: 4px solid #f59e0b;
                border-radius: 8px;
                padding: 20px;
                margin-top: 24px;
            }
            .appreciation-icon {
                font-size: 24px;
                margin-bottom: 8px;
            }
            .appreciation-text {
                font-size: 14px;
                color: #92400e;
                line-height: 1.6;
            }
            .footer {
                background: #f7fafc;
                padding: 30px;
                text-align: center;
                border-top: 1px solid #e2e8f0;
            }
            .footer-text {
                font-size: 13px;
                color: #718096;
                line-height: 1.8;
                margin-bottom: 12px;
            }
            .footer-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }
            .footer-link:hover {
                text-decoration: underline;
            }
            .social-section {
                margin-top: 20px;
                padding-top: 20px;
                border-top: 1px solid #e2e8f0;
            }
            .social-text {
                font-size: 13px;
                color: #718096;
                margin-bottom: 12px;
            }
            .social-links {
                display: flex;
                justify-content: center;
                gap: 12px;
            }
            .social-link {
                display: inline-block;
                padding: 8px 16px;
                border-radius: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: #ffffff;
                text-decoration: none;
                font-size: 13px;
                font-weight: 600;
                transition: transform 0.2s;
            }
            .social-link:hover {
                transform: translateY(-2px);
            }
            @media (max-width: 600px) {
                body {
                    padding: 20px 10px;
                }
                .header {
                    padding: 30px 20px;
                }
                .content {
                    padding: 30px 20px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-wrapper">
            <div class="header">
                <div class="logo-container">
                    <div class="logo-icon">🌐</div>
                </div>
                <h1 class="app-name">TRONGAN.SITE</h1>
                <p class="app-tagline">Nền tảng học tập và chia sẻ kiến thức</p>
            </div>
            
            <div class="content">
                <div class="thank-you-icon">🎉</div>
                <h2 class="greeting">Cảm ơn ${user || "bạn"}! ❤️</h2>
                <p class="message">
                    Chúng tôi đã nhận được đóng góp ý kiến của bạn. 
                    Mỗi ý kiến đều rất quan trọng giúp chúng tôi cải thiện sản phẩm tốt hơn!
                </p>
                
                <div class="content-box">
                    <div class="content-label">📝 Nội dung đóng góp của bạn:</div>
                    <div class="content-text">${content}</div>
                </div>
                
                <div class="appreciation-box">
                    <div class="appreciation-icon">⭐</div>
                    <div class="appreciation-text">
                        <strong>Đội ngũ phát triển</strong> sẽ xem xét và phản hồi sớm nhất có thể. 
                        Sự đóng góp của bạn giúp chúng tôi xây dựng một cộng đồng học tập tốt đẹp hơn!
                    </div>
                </div>
            </div>
            
            <div class="footer">
                <p class="footer-text">
                    Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ: 
                    <a href="mailto:trongandev@gmail.com" class="footer-link">trongandev@gmail.com</a>
                </p>
                
                <div class="social-section">
                    <p class="social-text">💬 Tham gia cộng đồng của chúng tôi:</p>
                    <div class="social-links">
                        <a href="https://discord.gg/mUqfzD3u" target="_blank" class="social-link">
                            🎮 Discord
                        </a>
                    </div>
                </div>
                
                <p class="footer-text" style="margin-top: 20px;">
                    © 2025 TrongAn.Site. All rights reserved.
                </p>
            </div>
        </div>
    </body>
</html>
    `;
};

module.exports = { HTML_TEMPLATE, CONTRIBUTE_HTML };
