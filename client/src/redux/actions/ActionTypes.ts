export interface IAction<T extends string, P> {
  // T必须是字符串
  type: T;
  payload: P;
}
