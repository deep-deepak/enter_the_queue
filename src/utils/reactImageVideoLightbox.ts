export const settle = (val: any, target: any, range: any) => {
    const lowerRange = val > target - range && val < target;
    const upperRange = val < target + range && val > target;
    return lowerRange || upperRange ? target : val;
  }
  
  export const getPointFromTouch = (touch: any) => {
    return {
      x: touch.clientX,
      y: touch.clientY
    };
  }
  
  export const getDistanceBetweenPoints = (pointA: any, pointB: any) => {
    return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
  }
  
  export const between = (min: any, max: any, value: any) => {
    return Math.min(max, Math.max(min, value));
  }