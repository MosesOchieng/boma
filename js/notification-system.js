class NotificationSystem {
  static notifications = [];
  static subscribers = [];

  static init() {
    this.checkForNewNotifications();
    setInterval(() => this.checkForNewNotifications(), 30000); // Check every 30 seconds
  }

  static addNotification(notification) {
    this.notifications.push({
      id: Date.now(),
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
    });
    this.notifySubscribers();
  }

  static markAsRead(notificationId) {
    const notification = this.notifications.find(
      (n) => n.id === notificationId,
    );
    if (notification) {
      notification.read = true;
      this.notifySubscribers();
    }
  }

  static subscribe(callback) {
    this.subscribers.push(callback);
  }

  static notifySubscribers() {
    this.subscribers.forEach((callback) => callback(this.notifications));
  }

  static checkForNewNotifications() {
    // Check for new urgent cases
    const urgentCases = sampleCases.filter(
      (c) => c.supportType === "immediate" && c.status === "pending",
    );

    urgentCases.forEach((case_) => {
      if (!this.notifications.some((n) => n.caseId === case_.caseId)) {
        this.addNotification({
          type: "urgent",
          title: "Urgent Case",
          message: `New urgent case from ${case_.name}`,
          caseId: case_.caseId,
        });
      }
    });
  }
}
