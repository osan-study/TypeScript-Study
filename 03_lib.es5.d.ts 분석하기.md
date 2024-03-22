## 3.1 Partial, Required, Readonly, Pick, Record

기존 객체의 속성을 전부 옵션으로 만드는 Partial 타입

```ts
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

type Result = MyPartial<{ a: string, b: number }>;

/*
type Result = {
  a?: string | undefined;
  b?: number | undefined;
}
*/
```

모든 속성을 필수로 만드는 Required 타입

```ts
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

type Result = MyRequired<{ a?: string, b?: number }>;

/*
type Result = {
  a: string;
  b: number;
}
*/
```

모든 속성을 readonly나 readonly가 아니게 만드는 Readonly 타입

```ts
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Result = MyReadonly<{ a: string, b: number }>;

/*
type Result = {
  readonly a: string;
  readonly b: number;
}
*/

type MyNotReadonly<T> = {
  -readonly [P in keyof T]: T[P];
};

type Result2 = MyNotReadonly<Result>

/*
type Result2 = {  
  a: string;  
  b: number;  
}
*/
```

객체에서 지정한 속성만 추리는 Pick 타입

```ts
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Result = MyPick<{ a: string, b: number, c: number }, 'a' | 'c'>;

/*
type Result = {
  a: string;
  c: number;
}
*/
```

모든 속성의 타입이 동일한 Record 타입

```ts
type MyRecord<K extends keyof any, T> = {
  [P in K]: T;
};

type Result = MyRecord<'a' | 'b', string>;

/*
type Result = {
  a: string;
  b: string;
}
*/
```
## 3.2 Exclude, Extract, Omit, NonNullable

지정한 타입을 제거하는 Exclude 타입

```ts
type MyExclude<T, U> = T extends U ? never : T;
type Result = MyExclude<1 | '2' | 3, string>;
// type Result = 1 | 3
```

지정한 타입만 추출하는 Extract 타입

```ts
type MyExtract<T, U> = T extends U ? T : never;
type Result = MyExtract<1 | '2' | 3, string>;
// type Result = "2"
```

지정한 속성을 제거하는 Omit 타입
 - Exclude를 이용해 지정한 속성을 제거하고 Pick 타입으로 추려낸 속성을 선택

```ts
type MyOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type Result = MyOmit<{ a: '1', b: 2, c: true }, 'a' | 'c'>;
// type Result = { b: 2 }
```

null과 undefined를 제거하는 NonNullable 타입

```ts
type MyNonNullable<T> = T extends null | undefined ? never : T;
type Result = MyNonNullable<string | number | null | undefined>;
// type Result = string | number

type MyNonNullable<T> = T & {};
```

일부 속성만 옵셔널로 만드는 옵셔널 타입
 - 옵셔널이 될 속성을 Pick으로 골라서 Partial을 적용하고 아닌 속성들은 Omit으로 추려 & 연산자로 합침

```ts
type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

type Result = Optional<{ a: 'hi', b: 123 }, 'a'>;
// type Result = { a?: 'hi', b: 123 }
```
## 3.3 Parameters, ConstructorParameters, ReturnType, InstanceType

```ts
type MyParameters<T extends (...args: any) => any>
  = T extends (...args: infer P) => any ? P : never;

type MyConstructorParameters<T extends abstract new (...args: any) => any>
  = T extends abstract new (...args: infer P) => any ? P : never;

type MyReturnType<T extends (...args: any) => any>
  = T extends (...args: any) => infer R ? R : any;

type MyInstanceType<T extends abstract new (...args: any) => any>
  = T extends abstract new (...args: any) => infer R ? R : any;
```

## 3.4 ThisType

메서드들에 this를 주입하는 타입

```ts
type Data = { money: number };
type Methods = {
  addMoney(amount: number): void;
  useMoney(amount: number): void;
};
type Obj = {
  data: Data;
  methods: Methods & ThisType<Data & Methods>;
};
const obj: Obj = {
  data: {
    money: 0,
  },
  methods: {
    addMoney(amount) {
      this.money += amount;
    },
    useMoney(amount) {
      this.money -= amount;
    }
  }
};
```

아래 구문 실행 시 money 값이 변경되지 않음

```ts
obj.methods.addMoney(10)
console.log(obj.data)

// { "money": 0 }
```

## 3.5 forEach 만들기

```ts
interface Array<T> {
  myForEach(callback: (v: T, i: number, a: T[]) => void): void;
}
```

this에서 발생하는 에러를 수정하기 위해 K를 선언하고 thisArg가 없을 경우 Window로 기본 설정

```ts
interface Array<T> {
  myForEach<K = Window>(callback: (this: K, v: T, i: number, a: T[]) => void, thisArg?: K): void;
}
```
## 3.6 map 만들기

map과 forEach의 가장 큰 차이는 반환값이 있다는 것이며 반환값을 타입을 미리 알 수 없으므로 제네릭 타입으로 선언

```ts
interface Array<T> {
  myMap<R>(callback: (v: T, i: number, a: T[]) => R): R[];
}
```

## 3.7 filter 만들기

오버로딩을 활용해 타입 서술 없이도 타입 추론이 가능하도록 작성

```ts
const r1 = [1, 2, 3].myFilter((v) => v < 2);
// const r1: number[]
const r2 = [1, 2, 3].myFilter((v, i, a): v is never => false);
const r3 = ['1', 2, '3'].myFilter((v): v is string => typeof v === 'string');
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myFilter(
  function(v) {
    return v.num % 2 === 1;
  }
);

/*
const r4: {
  num: number
}[]
*/

interface Array<T> {
  myFilter<S extends T>(callback: (v: T, i: number, a: T[]) => v is S, thisArg?: any): S[];
  myFilter(callback: (v: T, i: number, a: T[]) => boolean, thisArg?: any): T[];
}
```
## 3.8 reduce 만들기

reduce 메서드는 콜백 함수의 매개변수가 네 개로 누적값 a, 현재값 c, 인덱스 i, 원본 배열 arr로 구성

반환값은 요소의 타입과 다를 수 있으므로 오버로딩을 추가

```ts
const r1 = [1, 2, 3].myReduce((a, c) => a + c); // 6
const r2 = [1, 2, 3].myReduce((a, c, i, arr) => a + c, 10); // 16
const r3 = [{ num: 1 }, { num: 2 }, { num: 3 }].myReduce(
  function(a, c) {
    return { ...a, [c.num]: 'hi' };
  },
  {},
); // { 1: 'hi', 2: 'hi', 3: 'hi' }
const r4 = [{ num: 1 }, { num: 2 }, { num: 3 }].myReduce(
  function(a, c) {
    return a + c.num;
  },
  '',
); // '123'

interface Array<T> {
  myReduce(callback: (a: T, c: T, i: number, arr: T[]) => T, iV?: T): T;
  myReduce<S>(callback: (a: S, c: T, i: number, arr: T[]) => S, iV: S): S;
}
```

## 3.9 flat 분석하기

flat은 배열의 차원을 한 단계 낮추는 메서드

FlatArray는 인덱스 접근 방식으로 컨디셔널 타입을 구현한 타입으로 Depth가 -1일 때는 `done`, 그 외의 경우 `recur`을 출력한다

타입스크립트에서는 숫자 리터럴 타입에 연산을 할 수 없으므로 -1부터 20까지의 숫자를 미리 지정하고 있으며  depth가 21일 때 까지만 대비되어 있어 22 이상일 때는 최대한 flat한 값으로 출력된다

```ts
type FlatArray<Arr, Depth extends number> = {
  "done": Arr,
  "recur": Arr extends ReadonlyArray<infer InnerArr>
    ? FlatArray<InnerArr, [-1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20][Depth]>
    : Arr
}[Depth extends -1 ? "done" : "recur"];
...
interface Array<T> {
  flatMap<U, This = undefined> (
    callback: (this: This, value: T, index: number, array: T[]) => U | ReadonlyArray<U>,
    thisArg?: This
  ): U[]

  flat<A, D extends number = 1>(
    this: A,
    depth?: D
  ): FlatArray<A, D>[]
}
```

Depth마다 GetInner를 통해 InnerArr 를 출력하여 차원이 낮아진다

```ts
type GetInner<Arr> = Arr extends ReadonlyArray<infer InnerArr>
  ? InnerArr
  : Arr;
type OneDepthInner = GetInner<(number | (number | number[])[])[]>;
// type OneDepthInner = number | (number | number[])[]
type TwoDepthInner = GetInner<OneDepthInner>;
// type TwoDepthInner = number | number[]
```

## 3.10 Promise, Awaited 타입 분석하기

## 3.11 bind 분석하기