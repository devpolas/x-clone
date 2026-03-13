import TweetDetails from "@/components/tweets/tweet-details";
import { getSession } from "@/lib/actions/server/auth/auth-actions";
import {
  getTweetById,
  getTweetRepliesById,
} from "@/lib/actions/server/tweet/tweets-actions";
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

  const tweetReplies = await getTweetRepliesById(id);

  return (
    <TweetDetails
      tweet={tweet.tweet}
      replies={tweetReplies.tweetReplies ?? []}
      currentUserId={session.user.id}
    />
  );
}
