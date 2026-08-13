import css from "./CommentList.module.css";
import { useComments } from "@/hooks/useComments";
import { formatDate } from "@/lib/formatDate";

type PostCardProps = {
  postId: string;
};

export default function CommentList({ postId }: PostCardProps) {
  const { data: comments } = useComments(postId);
  return (
    <div className={css.container}>
      {comments?.map((comment) => (
        <div key={comment.id} className={css.commentCont}>
          <div className={css.info}>
            <span className={css.text}>{comment.authorName}</span>
            <span className={css.text}>{formatDate(comment.createdAt)}</span>
          </div>
          <p className={css.content}>{comment.content}</p>
        </div>
      ))}
    </div>
  );
}
