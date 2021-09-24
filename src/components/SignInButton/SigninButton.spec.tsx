import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { useSession } from 'next-auth/client';
import { SignInButton } from '.';

jest.mock('next-auth/client');

describe('SignInButton component', () => {
    test('SignInButton renders correctly when use is not authenticated', () => {
        
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([null, false])
        
        render(
            <SignInButton />
        );

        expect(screen.getByText('Sign in with Github')).toBeInTheDocument();
    })
    test('SignInButton renders correctly when use is authenticated', () => {
        
        const useSessionMocked = mocked(useSession);
        useSessionMocked.mockReturnValueOnce([
            {user: {name: 'John Doe', email: 'jdoe@example.com'}, expires: 'fake-expires'},
            false
        ])
        
        render(
            <SignInButton />
        );

        expect(screen.getByText('John Doe')).toBeInTheDocument();
    })
})