
import { PageHeader } from '@/components/page-header';
import { FeedList } from './_components/feed-list';

export default function FeedPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <PageHeader
        title="Activity Feed"
        description="See what's new in the Pet-Pal community."
      />
      <div className="max-w-2xl mx-auto">
        <FeedList />
      </div>
    </div>
  );
}
