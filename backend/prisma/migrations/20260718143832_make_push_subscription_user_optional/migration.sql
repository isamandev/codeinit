-- AlterTable
-- Push subscriptions no longer require a logged-in user: job alerts can be
-- subscribed to and unsubscribed from anonymously.
ALTER TABLE "push_subscriptions" ALTER COLUMN "userId" DROP NOT NULL;
