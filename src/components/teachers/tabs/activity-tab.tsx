import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getNavigationIcon } from '@/components/navigation/navigation-icons';
import { getPerformanceData } from '../data/mock-data';

export function ActivityTab() {
  const performanceData = getPerformanceData();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Timeline of teacher activities and tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="mt-1">
                  {activity.type === 'exam' && getNavigationIcon('file')}
                  {activity.type === 'planning' && getNavigationIcon('calendar')}
                  {activity.type === 'meeting' && getNavigationIcon('users')}
                  {activity.type === 'grading' && getNavigationIcon('star')}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.activity}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(activity.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>Recognition and accomplishments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {performanceData.achievements.map((achievement, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="mt-1">
                  {getNavigationIcon('trophy')}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{achievement.title}</p>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(achievement.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
