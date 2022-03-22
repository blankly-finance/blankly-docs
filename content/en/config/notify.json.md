---
title: notify.json
description: 'Key/value descriptions for notify.json'
position: 38
version: 1.0
category: Config

---

The `notify.json` file is used to store configurations for services used to notify you for events in signals or other custom email/text events.

This file is only necessary if attempting to send emails or texts. 

This file should be left out of version control.

## Format

```json[notify.json]
{
  "email": {
    "port": 465,
    "smtp_server": "smtp.website.com",
    "sender_email": "email_attached_to_smtp_account@web.com",
    "receiver_email": "email_to_send_to@web.com",
    "password": "my_password"
  },
  "text": {
    "phone_number": "1234567683",
    "provider": "verizon"
  }
}
```

| Key            | Description                                                  | Type |
| -------------- | ------------------------------------------------------------ | ---- |
| port           | SMTP port that your service uses                             | int  |
| smtp_server    | URL of the SMTP server to connect to                         | str  |
| sender_email   | The email that the SMTP account should use                   | str  |
| receiver_email | The email that should receive the message sent by the sender_email | str  |
| password       | The password to log into your SMTP service                   | str  |
| phone_number   | For text notifications, fill this with your phone number without dashes, spaces or formatting. Texting requires valid SMTP information to be filled because it uses text over gateways. Expect messages from your SMTP email. Msg & data rates may apply. | str  |
| provider       | The messaging provider that you use. Currently supports the strings: `att`, `boost`, `cricket`, `sprint`, `t_mobile`, `us_cellular`, `verizon`, `virgin_mobile`. Texting requires valid SMTP information to be filled because it uses text over gateways. Expect messages from your SMTP email. Msg & data rates may apply. | str  |

## Usage

SMTP services can be configured on sites such as [sendinblue](https://www.sendinblue.com). Make sure you use SMTP rather than their REST API services. Your local SMTP configuration will only be used when blankly is running locally on your computer. When deployed live, the `notify.json` settings will be ignored and messages and emails will be sent from official services. Local texts are sent to a gateway email based on provider, such as  `1234567683@vtext.com`, so that requires your SMTP information

