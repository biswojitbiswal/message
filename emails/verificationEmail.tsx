import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text
} from '@react-email/components';
import * as React from 'react';

interface VerificationEmailProps {
    username?: string;
    otp?: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({
    username, otp
}) => {
    const companyName = 'Message';
    const previewText = `${companyName} - Verify your email address`;

    return (
        <Html>
            <Head />
            <Preview>{previewText}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={heading}>Verify your email address</Heading>

                    <Section>
                        <Text style={paragraph}>Hello {username},</Text>
                        <Text style={paragraph}>
                            Thanks for signing up for {companyName}! Before we get started, we just need to verify your email address.
                        </Text>
                        <Text style={paragraph}>
                            Your verification code is:
                        </Text>
                        <Text style={codeContainer}>{otp}</Text>
                        <Text style={paragraph}>
                            This code will expire in 24 hours.
                        </Text>
                        <Text style={paragraph}>
                            Please enter this code in the verification page to complete your registration.
                        </Text>
                        <Text style={paragraph}>
                            If you did not sign up for a {companyName} account, you can safely ignore this email.
                        </Text>
                    </Section>

                    <Section style={footer}>
                        <Text style={footerText}>
                            © {new Date().getFullYear()} {companyName}. All rights reserved.
                        </Text>
                        
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

// Styles
const main = {
    backgroundColor: '#f6f9fc',
    fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
    padding: '60px 0'
};

const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #e8e8e8',
    borderRadius: '5px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    maxWidth: '600px',
    margin: '0 auto',
    padding: '40px'
};

const heading = {
    color: '#333',
    fontSize: '24px',
    fontWeight: 'bold',
    lineHeight: '30px',
    marginBottom: '24px',
    textAlign: 'center' as const
};

const paragraph = {
    color: '#404040',
    fontSize: '16px',
    lineHeight: '24px',
    marginBottom: '16px'
};

const codeContainer = {
    backgroundColor: '#f4f4f4',
    borderRadius: '5px',
    color: '#333',
    display: 'block',
    fontFamily: 'monospace',
    fontSize: '24px',
    fontWeight: 'bold',
    letterSpacing: '4px',
    margin: '24px auto',
    padding: '16px',
    textAlign: 'center' as const,
    width: '50%'
};

const footer = {
    borderTop: '1px solid #e8e8e8',
    marginTop: '32px',
    paddingTop: '24px'
};

const footerText = {
    color: '#777',
    fontSize: '12px',
    lineHeight: '20px',
    marginBottom: '8px'
};


export default VerificationEmail;