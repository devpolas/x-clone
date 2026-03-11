import type { TweetType } from "@/types/tweet";

export function buildReplyTree(
  replies: TweetType[],
  rootId: string,
): TweetType[] {
  const map = new Map<string, TweetType>();
  const roots: TweetType[] = [];

  replies.forEach((reply) => {
    map.set(reply.id, { ...reply, children: [] });
  });

  replies.forEach((reply) => {
    const node = map.get(reply.id)!;

    if (reply.parentId === rootId) {
      roots.push(node);
    } else if (reply.parentId && map.has(reply.parentId)) {
      map.get(reply.parentId)!.children!.push(node);
    }
  });

  return roots;
}
