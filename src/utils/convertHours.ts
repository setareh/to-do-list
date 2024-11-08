function convertHours(hours: number): string {
    if (hours < 8) {
      return `${hours}h`;
    } else if (hours < 24) {
      const days = Math.floor(hours / 8);
      const remainingHours = hours % 8;
      return remainingHours ? `${days}d ${remainingHours}h` : `${days}d`;
    } else if (hours < 40) {
      const days = Math.floor(hours / 8);
      return `${days}d`;
    } else if (hours < 160) {
      const weeks = Math.floor(hours / 40);
      const remainingDays = Math.floor((hours % 40) / 8);
      return remainingDays ? `${weeks}w ${remainingDays}d` : `${weeks}w`;
    } else {
      const months = Math.floor(hours / 160);
      const remainingWeeks = Math.floor((hours % 160) / 40);
      return remainingWeeks ? `${months}m ${remainingWeeks}w` : `${months}m`;
    }
  }
  
  export { convertHours };
  