# CPSC-362-Chat-App-Project
## Table of Contents
- [Overview](#overview)
- [Project Vision](#project-vision)
- [Features](#features)
- [Functional Requirements](#functional-requirements)

## Overview
The Chat Application is designed for real-time communication, allowing users to send text messages, share media, and participate in group conversations. This project provides a fast, secure, and user-friendly chat experience.

## Project Vision
Our goal is to create a versatile chat application tailored for individual users and small groups or businesses who need efficient, secure communication.

Target Audience: Individuals, small groups, and businesses.
Main Goal: Provide a real-time messaging platform with media sharing and group chat capabilities.
## Features
User Registration & Login: Secure user authentication.
Real-time Messaging: Instant message delivery.
Multimedia Sharing: Share images, videos, and files in conversations.
Group Chats: Create and join chat groups.
Notifications: Receive real-time notifications for new messages.

## Functional Requirements

| **ID** | **Name**                  | **Description**                                                    | **Actor**        | **Precondition**                                    | **Main Success Scenario**                                                                 | **Extensions**                                                                                      |
|--------|---------------------------|--------------------------------------------------------------------|------------------|----------------------------------------------------|------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| 001    | User Profile Creation and Customization  | Allows users to create an account, log in, and log out of the system | User             | User has a valid email address.                    | 1. User enters details. <br>2. System creates an account. <br>3. User logs in and is directed to the dashboard. | Invalid email or password. <br> Email already registered. <br> Account recovery if forgotten password. |
| 002    | Send & Receive Messages    | Allows users to send and receive real-time messages with other users. | User             | User is logged in and chatting with another user.  | 1. User opens chat window. <br>2. User types a message and clicks “Send.” <br>3. System sends the message in real-time. | Recipient is offline (message stored for later). <br> Network failure. Retry sending.         |
| 003    | Multimedia Sharing         | Allows users to upload and share images, videos, and files in chats.  | User             | User is logged in and in an active chat.           | 1. User clicks "Upload." <br>2. Selects a file. <br>3. System uploads and sends the file. | File size exceeds limit. <br> Unsupported file format.                                        |
| 004    | Group Chat Functionality   | Users can create or join group chats with multiple participants.      | User             | User is logged in.                                 | 1. User selects "Create Group." <br>2. User invites others to join. <br>3. Group chat is created. | Invitee rejects group invite. <br> User leaves group, system updates the group list.            |
| 005    | Notifications              | System notifies users when a new message is received.                 | User, System     | User is logged in, but chat window is inactive.    | 1. System detects new message. <br>2. Sends a notification to the user's device.           | "Do Not Disturb" mode prevents notification.                                                      |
