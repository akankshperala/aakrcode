import ProblemClient from './ProblemClient';

export default async function ProblemPage({ params }) {
  // params works here because it's a Server Component
  const { slug } =await params;

  return <ProblemClient slug={slug} />;
}
