import type { Metadata } from 'next';
import { allPages } from '@/.content-collections/generated';
import { Mdx } from '@/components/mdx';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About',
  description: 'Committed to developing individuals and teams for success.',
};

const About = () => {
  const content = allPages.find((page) => page._meta.path === 'about');

  return (
    <div>
      <h1 className="text-3xl bg-clip-text text-transparent bg-linear-to-r from-neutral-800 to-neutral-500 dark:from-neutral-100 dark:to-neutral-400 font-semibold mb-8">
        {content?.title}
      </h1>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        <div className="w-full mb-4">
          <Image
            alt="Johnie"
            src="/images/johnie-omni.jpg"
            width={648}
            height={432}
            blurDataURL="data:image/webp;base64,UklGRoADAABXRUJQVlA4WAoAAAAgAAAA7wAAnwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggkgEAADATAJ0BKvAAoAA+0WCqUaglI6KkUNo5ABoJaW7gQQaTbf+3Tz22I6LG/JH0ARU48C4YWK4YQJFyeQB1XlWU+V+BMIOh9UvRzgalARKJvz4kFbILDRFKZAaLReiTFQxcyOG1CxqL5YNfSLGLwpNis553t5Qk0Csh9o7KrwcwwkgGWVGPwpNpvDXOe4XPVDGY/DEgbqOu+At20q7hTFbbj5C/AAD+70j5Q65T2Wz2l+5Rua4Fk3R+REX+PPTRy3TyxckhoOK1HRfNjjYY9VPuMSu5w+lwJMOIHVckfSsqj3vgmz1UGWQFduwU4WGcTdfErKlZ54Yh14YBxFn3y4GQBqk1LuGHczOICDbXYIE7Uxu2B2cl76zlNG6PW2XqazHrAOei8ngWrssSNVIcQJpTwNqQ37fytTEO7eMeS+yQYAaEfwPr/WMsJ7kks9O58EtnUSiI29PRTtBB8c26CH4FBzpXXaZRe7qpDczUVPJO4qAFNtU2dJ+EaaV7LfRY2QCYfJTmibrhvcYXk+2x68FYsdQAAA=="
            className="rounded w-full h-auto"
            priority
          />
        </div>
        <Mdx code={content?.mdx as string} />
      </article>
    </div>
  );
};

export default About;
