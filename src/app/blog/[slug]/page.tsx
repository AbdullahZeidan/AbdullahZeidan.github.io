import format from 'date-fns/format'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next/types'
import DEFAULT_SEO from 'seo.config'
import BlinkingCursor from '@/components/BlinkingCursor'
import PostNotPublishedAlert from '@/components/PostNotPublishedAlert'
import Section from '@/components/Section'
import CustomMDXRemote from '@/components/mdx/MDXRemote'
import '@/styles/pretty-code.css'
import { containerCls } from '@/utils/classnames'
import { cn } from '@/utils/css'
import { filterPublishedPosts, getAllPosts, getPostBySlug } from '@/utils/mdx'

const allPosts = getAllPosts()

export function generateStaticParams() {
    return allPosts
        .filter(filterPublishedPosts)
        .map(post => ({ slug: post.slug }))
}

export function generateMetadata({
    params,
}: {
    params: { slug: string }
}): Metadata {
    const post = getPostBySlug(allPosts, params.slug)

    if (!post) {
        return notFound()
    }

    const { title, description } = post

    return {
        ...DEFAULT_SEO,
        title,
        description,
        openGraph: { title, description },
    }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = getPostBySlug(allPosts, params.slug)

    if (!post) {
        return notFound()
    }

    return (
        <>
            <header className='relative isolate flex aspect-[2/1] max-h-80 w-full flex-col justify-end border-b border-b-neutral-500/20 object-cover xl:max-h-96'>
                <div className='absolute inset-0 -z-10 bg-gradient-to-b from-black/10 to-black/90' />
                <Image
                    src={post.thumbnailUrl ?? '/images/og-template.png'}
                    alt=''
                    className='-z-20 select-none bg-neutral-400 object-cover'
                    fill
                    quality={85}
                    priority
                />

                <hgroup
                    className={cn(
                        containerCls,
                        'mb-4 w-full max-w-3xl md:mb-6',
                    )}
                >
                    <h1 className='mb-4 me-auto w-full font-mono text-4xl font-extrabold tracking-tighter text-light [text-wrap:balance] sm:text-5xl md:mb-6 lg:text-6xl'>
                        {post.title}
                        <BlinkingCursor type='|' />
                    </h1>
                    <time
                        dateTime={post.date.toISOString()}
                        className='block text-sm text-neutral-400'
                    >
                        Posted on {format(post.date, 'LLLL do, yyyy')}
                    </time>
                </hgroup>
            </header>
            <Section className={cn(containerCls, 'max-w-3xl pt-6 md:pt-6')}>
                {process.env.NODE_ENV === 'development' &&
                    !post.isPublished && (
                        <div className='mb-8'>
                            <PostNotPublishedAlert />
                        </div>
                    )}

                <article className='prose prose-brand max-w-none dark:prose-invert lg:prose-lg prose-headings:font-semibold prose-p:text-base/[1.7]'>
                    <CustomMDXRemote source={post.content} />
                </article>
            </Section>
        </>
    )
}
