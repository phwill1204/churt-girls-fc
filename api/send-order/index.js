const nodemailer = require('nodemailer');

module.exports = async function (context, req) {
    context.log('Processing order submission');

    // Get order data from request body
    const orderData = req.body;

    if (!orderData || !orderData.players || orderData.players.length === 0) {
        context.res = {
            status: 400,
            body: { error: "No order data provided" }
        };
        return;
    }

    try {
        // Create email transporter using SendGrid SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.sendgrid.net',
            port: 587,
            auth: {
                user: 'apikey',
                pass: process.env.SENDGRID_API_KEY
            }
        });

        // Build HTML email with table
        const htmlContent = buildEmailHtml(orderData);

        // Send email
        const info = await transporter.sendMail({
            from: 'noreply@churtgirlsfc.com', // You can customize this
            to: 'philipjohnwilliams@gmail.com',
            subject: `Kit Order - ${orderData.teamName || 'Churt Girls FC'}`,
            html: htmlContent
        });

        context.log('Email sent successfully:', info.messageId);

        context.res = {
            status: 200,
            body: { 
                success: true, 
                message: "Order submitted successfully!",
                messageId: info.messageId
            }
        };

    } catch (error) {
        context.log.error('Error sending email:', error);
        context.res = {
            status: 500,
            body: { 
                error: "Failed to send order email",
                details: error.message
            }
        };
    }
};

function buildEmailHtml(orderData) {
    const { teamAge, teamName, managerName, players } = orderData;

    let playerRows = '';
    players.forEach((player, index) => {
        playerRows += `
        <tr style="background-color: ${index % 2 === 0 ? '#f9f9f9' : '#ffffff'};">
            <td style="padding: 8px; border: 1px solid #ddd;">${player.playerName || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.sponsorName || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.shirtNumber || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.shirtType || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.shirtSize || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.shortsSize || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.shortsType || ''}</td>
            <td style="padding: 8px; border: 1px solid #ddd;">${player.socksSize || ''}</td>
        </tr>`;
    });

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; }
            .header { background: linear-gradient(135deg, #ff8c00 0%, #ff6b35 100%); color: white; padding: 20px; }
            table { border-collapse: collapse; width: 100%; margin-top: 20px; }
            th { background-color: #ff8c00; color: white; padding: 10px; border: 1px solid #ddd; text-align: left; }
            td { padding: 8px; border: 1px solid #ddd; }
        </style>
    </head>
    <body>
        <div class="header">
            <h2>Churt Girls FC - Kit Order</h2>
        </div>
        <div style="padding: 20px;">
            <h3>Order Details</h3>
            <p><strong>Team Age:</strong> ${teamAge || 'N/A'}</p>
            <p><strong>Team Name:</strong> ${teamName || 'N/A'}</p>
            <p><strong>Manager Name:</strong> ${managerName || 'N/A'}</p>
            
            <h3>Player Orders (${players.length} player${players.length !== 1 ? 's' : ''})</h3>
            <table>
                <thead>
                    <tr>
                        <th>Player Name</th>
                        <th>Sponsor</th>
                        <th>Number</th>
                        <th>Shirt Type</th>
                        <th>Shirt Size</th>
                        <th>Shorts Size</th>
                        <th>Shorts Type</th>
                        <th>Socks Size</th>
                    </tr>
                </thead>
                <tbody>
                    ${playerRows}
                </tbody>
            </table>
            <p style="margin-top: 20px; color: #666; font-size: 12px;">
                This order was submitted via the Churt Girls FC online order form on ${new Date().toLocaleString()}.
            </p>
        </div>
    </body>
    </html>`;
}
