import styles from '../styles.module.css';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
}

const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Maximizing Your Pop-Up Success',
    excerpt: 'Learn the top strategies for making the most of your pop-up shop experience and increasing sales.',
    category: 'Business Tips',
    readTime: '5 min read',
    date: '2024-04-10'
  },
  {
    id: '2',
    title: 'Event Application Best Practices',
    excerpt: 'Discover how to create compelling applications that stand out to event organizers.',
    category: 'Applications',
    readTime: '4 min read',
    date: '2024-04-05'
  },
  {
    id: '3',
    title: 'Building Your Vendor Network',
    excerpt: 'Tips for connecting with other vendors and creating valuable partnerships in the pop-up space.',
    category: 'Networking',
    readTime: '6 min read',
    date: '2024-03-28'
  }
];

export default function GuidesAndResources() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Guides & Resources</h2>
      <div className={styles.blogGrid}>
        {mockBlogPosts.map((post) => (
          <div key={post.id} className={styles.blogCard}>
            <div className={styles.blogContent}>
              <div className={styles.blogHeader}>
                <span className={styles.blogCategory}>{post.category}</span>
                <span className={styles.blogReadTime}>{post.readTime}</span>
              </div>
              <h3 className={styles.blogTitle}>{post.title}</h3>
              <p className={styles.blogExcerpt}>{post.excerpt}</p>
              <div className={styles.blogFooter}>
                <span className={styles.blogDate}>
                  {new Date(post.date).toLocaleDateString()}
                </span>
                <button className={styles.readMoreButton}>Read More</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 