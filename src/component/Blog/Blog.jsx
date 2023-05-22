import React from 'react';
import PageTitle from '../PageTitle/PageTitle';

const Blog = () => {
    return (
        <div className='container my-5'>
            <PageTitle title={"Blog"}></PageTitle>
            <h1>1.What is an access token and refresh token? How do they work and where should we store them on the client-side?
            </h1>
            <article>

                An access token is a credential issued to a user after successful authentication. It grants access to protected resources and is typically short-lived. It is used to authorize and perform actions on behalf of the authenticated user.

                A refresh token is also issued during authentication and is used to obtain a new access token when the current one expires. Refresh tokens are long-lived and stored securely on the client-side.

                Both tokens should be stored securely on the client-side, with access tokens typically stored in memory or browser storage, and refresh tokens stored in a more persistent storage like secure cookies or encrypted local storage.
            </article>



            <h1>2.Compare SQL and NoSQL databases?</h1>
            <article>

                SQL databases are based on a structured model with predefined schemas and use SQL for data manipulation. They offer strong data integrity and are suitable for complex relationships and large-scale applications. On the other hand, NoSQL databases are schema-flexible, designed for handling unstructured data, and provide high scalability for large data volumes and high traffic loads. They offer more flexibility but sacrifice some of the strict data integrity guarantees of SQL databases.
            </article>


            <h1>3.What is express js? What is Nest JS?</h1>
            <article>
                Express.js is a minimalistic web application framework for Node.js, while Nest.js is a progressive and extensible framework built on top of Express.js with additional features and architectural patterns.
            </article>


            <h1>
                4.What is MongoDB aggregate and how does it work?
            </h1>
            <article>
                MongoDB Aggregation is a framework for performing data processing operations on MongoDB collections. It allows you to process and transform data using various stages such as filtering, grouping, sorting, and aggregating. Aggregation pipeline consists of multiple stages that can be chained together to perform complex data manipulations. Each stage receives input from the previous stage, processes the data, and passes it to the next stage until the final result is obtained. Aggregation provides powerful capabilities for data analysis, reporting, and generating aggregated results based on specified criteria.
            </article>

        </div>
    );
};

export default Blog;