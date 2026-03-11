import TweetDetails from "@/components/tweets/tweet-details";
import { getSession } from "@/lib/actions/server/auth-actions";
import { getTweetById } from "@/lib/actions/tweet/tweets-actions";
import { redirect } from "next/navigation";

export default async function TweetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const paramsResolved = await params;
  const id = paramsResolved.id;

  const session = await getSession();
  if (!session?.user) {
    redirect(`/signin?callbackURL=/tweet/${id}`);
  }

  const tweet = await getTweetById(id);

  if (!tweet.success || !tweet.tweet) {
    redirect("/");
  }

  return (
    <TweetDetails
      tweet={tweet.tweet}
      replies={null}
      currentUserId={session?.user.id}
    />
  );
}
