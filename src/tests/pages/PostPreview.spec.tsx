import { render, screen } from '@testing-library/react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { mocked } from 'ts-jest/utils';
import Post, { getStaticProps } from '../../pages/posts/preview/[slug]';
import { getPrismicClient } from '../../services/prismic'

const post = { 
    slug:'my-new-post', 
    title: 'My New Post', 
    content: '<p>Post excerpt</p>', 
    updatedAt: '01 de abril de 2021' 
}

jest.mock('next-auth/client');
jest.mock('next/router');

describe('Post preview page',  () => {

    const useSessionMocked = mocked(useSession);
    useSessionMocked.mockReturnValueOnce([null, false]);

    it('renders correctly', () => {
        render(<Post post={post}/>)

        expect(screen.getByText("My New Post")).toBeInTheDocument();
        expect(screen.getByText("Post excerpt")).toBeInTheDocument();
        expect(screen.getByText("Wanna continue reading ?")).toBeInTheDocument();
    })

    it('redirects user to full post when user is subscribed', async () => {

        const useSessionMocked = mocked(useSession);
        const userRouterMocked = mocked(useRouter);
        const pushMocked = jest.fn();

        useSessionMocked.mockReturnValueOnce([
            { activeSubscription: 'fake-active-subscription' },
            false
        ] as any);

        userRouterMocked.mockReturnValueOnce({
            push: pushMocked
        } as any);

        render(<Post post={post}/>)

        expect(pushMocked).toHaveBeenCalledWith('/posts/my-new-post');

    })

    it('loads initial data', async() => {
        

        const getPrismicClientMocked = mocked(getPrismicClient);
        getPrismicClientMocked.mockReturnValueOnce({
            getByUID: jest.fn().mockResolvedValueOnce({
                data: {
                    title: [
                        { type : 'heading', text: 'My New Post' }
                    ],
                    content: [
                        { type: 'paragraph', text: 'Post excerpt' }
                    ]
                },
                last_publication_date: '04-01-2022'
            })
        } as any);

        const response = await getStaticProps({
           params: {
                slug: 'my-new-post'
           }
        } as any )

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    post: {
                        slug: 'my-new-post',
                        title: 'My New Post',
                        content: '<p>Post excerpt</p>',
                        updatedAt: '01 de abril de 2021'
                    }
                }
            })
        )

    })
})