export function getStartOfLastWeek() {
    const now = new Date();
    const startOfLastWeek = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - now.getUTCDay() - 6,
      0, 0, 0, 0
    );
    return startOfLastWeek;
  }
  
  export function getEndOfLastWeek() {
    const now = new Date();
    const endOfLastWeek = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - now.getUTCDay(),
      23, 59, 59, 999
    );
    return endOfLastWeek;
  }
  
  export function getStartOfLastMonth() {
    const now = new Date();
    const startOfLastMonth = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth() - 1,
      1,
      0, 0, 0, 0
    );
    return startOfLastMonth;
  }
  
  export function getEndOfLastMonth() {
    const now = new Date();
    const endOfLastMonth = new Date(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      0,
      23, 59, 59, 999
    );
    return endOfLastMonth;
  }
  
  export function getStartOfLastQuarter() {
    const now = new Date();
    const startOfLastQuarter = new Date(
      now.getUTCFullYear(),
      Math.floor(now.getUTCMonth() / 3) * 3 - 3,
      1,
      0, 0, 0, 0
    );
    return startOfLastQuarter;
  }
  
  export function getEndOfLastQuarter() {
    const now = new Date();
    const endOfLastQuarter = new Date(
      now.getUTCFullYear(),
      Math.floor(now.getUTCMonth() / 3) * 3,
      0,
      23, 59, 59, 999
    );
    return endOfLastQuarter;
  }
  