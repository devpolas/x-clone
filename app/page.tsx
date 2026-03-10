import Tweet from "@/components/tweets/tweet";
import MainLayout from "@/layouts/main-layout";
import { getSession } from "@/lib/actions/server/auth-actions";
import { getTweets } from "@/lib/actions/tweet/tweets-actions";

export default async function page() {
  const session = await getSession();
  const tweetsResult = await getTweets();
  const tweets = tweetsResult.success ? tweetsResult.tweets || [] : [];
  return (
    <MainLayout>
      <div className='border-border border-b'>
        <div className='p-4'>
          <h1 className='font-bold text-xl'>Home</h1>
        </div>
      </div>

      <div className='divide-y divide-border'>
        {tweets.length > 0 ? (
          tweets.map((tweet, key) => (
            <Tweet key={key} tweet={tweet} currentUserId={session?.user.id} />
          ))
        ) : (
          <div className='p-8 text-muted-foreground text-center'>
            <p>No tweets yet. Be the first tweet!</p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
