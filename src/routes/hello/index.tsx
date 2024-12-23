import { component$, useSignal, useTask$, useStylesScoped$ } from '@builder.io/qwik'
import { routeLoader$, Form, routeAction$, server$ } from '@builder.io/qwik-city';
import styles from "./index.css?inline";

export const useZennArticle = routeLoader$(async () => {
    const response = await fetch("https://zenn.dev/api/articles?username=thirdlf&order=latest");
    return response.json();
})

export const useVoteAction = routeAction$((props) => {
    console.log('VOTE', props);
});

export default component$(() => {
    useStylesScoped$(styles);
    const isLike = useSignal(false);
    const zennArticles = useZennArticle();
    const voteAction = useVoteAction();

    useTask$(({ track }) => {
        track(() => isLike.value);
        console.log('(isomorphic)', isLike.value);
        server$(() => {
            console.log('(server)', isLike.value);
        })();
    });

    return (
        <div>
            <h1>Hello, World!</h1>
            <div>
                {zennArticles.value.articles.map((article: any) => (
                    <div key={article.id} align="center">
                        <p>記事名: {article.title}</p>
                        <button onClick$={() => {
                            article.liked_count > 0 ? isLike.value = !isLike.value : isLike.value = false;
                        }}>いいねチェック
                        </button>
                        {isLike.value ? <p>いいね数: {article.liked_count}</p> : <p>いいね数チェックしてね</p>}
                        <Form action={voteAction}>
                            <input type="hidden" name="voteID" value={article.id} />
                            <button name="vote" value="up">👍</button>
                            <button name="vote" value="down">👎</button>
                        </Form>
                    </div>
                ))}
            </div>
        </div>
    )
})