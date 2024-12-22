import { component$ } from '@builder.io/qwik'
import { routeLoader$ } from '@builder.io/qwik-city';

export const getZennArticle = routeLoader$(async () => {
    const response = await fetch("https://zenn.dev/api/articles?username=thirdlf&order=latest");
    return response.json();
})

export default component$(() => {
    const zennArticles = getZennArticle();
    return (
        <div>
            <h1>Hello, World!</h1>
            <div>
                {zennArticles.value.articles.map((article: any) => (
                    <div key={article.id} align="center">
                        <p>記事名: {article.title}</p>
                        <p>いいね数: {article.liked_count}</p>
                    </div>
                ))}
            </div>
        </div>
    )
})