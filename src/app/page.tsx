import React from 'react';
import GlobalPostsList from './blog/BlogPage';

const BlogPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Roladvising.eu</h1>
      <GlobalPostsList />
    </div>
  );
};

export default BlogPage;
