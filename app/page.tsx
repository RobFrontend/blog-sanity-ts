import Link from "next/link";
import { type SanityDocument } from "next-sanity";

import { client } from "@/sanity/client";
import Image from "next/image";

import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, image}`;

const options = { next: { revalidate: 30 } };

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  const { projectId, dataset } = client.config();
  const urlFor = (source: SanityImageSource) =>
    projectId && dataset
      ? imageUrlBuilder({ projectId, dataset }).image(source)
      : null;

  console.log(posts);
  console.log(posts[0].image.asset._ref);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-8">
      <h1 className="text-4xl font-bold mb-8">Posts</h1>
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => {
          const imageUrl = post.image
            ? urlFor(post.image)?.width(550).height(310).url()
            : null;

          return (
            <li className="hover:underline" key={post._id}>
              {imageUrl && (
                <Image src={imageUrl} width={300} height={500} alt="xd" />
              )}
              <Link href={`/${post.slug.current}`}>
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
