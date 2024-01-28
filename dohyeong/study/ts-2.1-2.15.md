# 2장 : 기본 문법 익히기 1
> 범위: 2.1 ~ 2.15 

## 기본 타입

타입 스크립트 사용시에는 어떠한 타입을 부여할지 알고 표기해야한다. 
기본 타입은 아래와 같다. 
- string
- number
- boolean
- null
- underfined
- symbol (es2015 이상 버전에서 사용가능)
- bigint (es2020 이상 버전에서 사용가능)
- object

### 변수에 사용

``` typescript
const str: string='hello'
const num: number = 123
const bool: boolean = false
const nullRel: null = null
const udfRel: undefined = undefined
const sym: symbol = Symbol('sym')
const big: bigint = 10000000n
const obj: object = {hello: 'world'}
```


### 함수에 사용

``` typescript
// 선언형 함수
function plus(x: number, y: number): number {
	return x+y
}

// 화살표 함수 | 표현식 함수 
const minus = (x:number, y:number):number=>x+y
```

---
## 타입을 사용하지 않으면 타입은 스스로 인식하게 된다. 
이를 타입 추론이라고 하며, 해당 변수의 값에 따라 타입은 추론하여 처리된다. 
다만, 값이 자주 변하거나 매개변수로 사용하는 경우에는 타입을 부여하여 명확하게 인지 할 수 있도록 하자~

> 교재에서는 타입추론을 적극 활용하자 라고 되어있으나, 
> 실제 코드 사용시 모든 변수/함수에 대하여 타입을 명기하라고 하는경우가 더 많다. 
> (옵션설정에 따라 다름)

```typescript

const str = 'hello'     // 타입은 hello 
const num = 123         // 타입은 123
const bool = false      // 타입은 false
const nulRel = null     // 타입은 null 
```

>실제 타입은 주어진 값을 타입으로 인지하여 처리되므로 표기를 해주는 것이 낫다고 생각함
>다만, 실제로 사용하는 경우 생각보다 꽤 까다로운 설정이 되게 되어 있으므로, 여러 방향으로 생각해 볼것!!

#### Tip: `{}` 표현

**`{}`** 표현 은 객체를 의미하는 것이 아니라 null과 undefined를 제외한 모든 타입을 의미

#### Tip2: 타입에러 무시방법 `@ts..`

- `//@ts-ignore` 에러나는 코드 윗줄(에러발생 | 미발생 관계 없음)에 
                            주석으로 달아주면 에러를 무시하는 코드로 처리됨(일부만 적용가능)
- `//@ts-expect-error` 다음줄에 에러가 난다면 무시하는 코드로 에러가 나지 않으면 에러발생하는 코드 

실제 에러가 발생하는 코드에는 
`//@ts-expect-error`코드를 작성하여 에러 미 발생시 에러를 표기하여표기하여 
불필요한 내용을 삭제하는 것을 권장. 

---
## 리터럴 타입

타입스크립트는 자바스크립트가 가지는 특징인 표현의 자유 
즉, 타입전환의 자유등을 포기하고 안정성을 가지는 언어이다. 

하지만 객체 리터를 타입을 사용시 의도한 것보다 리터를 타입이 부정확하게 추론되거나 오히려 결과물이 에러를 발생하기도 한다. 

```typescript
const obj = {user:'xido'}      // const obj:{user:string}
const arr = [1,3,'zero']       // const arr:(string|number)[]
```

`(string | number)[]` 표기는 문자 또는 숫자의 배열이라는 해석으로 obj타입과 다르므로 구분하여 사용할 필요가 있다. 

또한 `DOM` 사용시 HTMLElement , React.MouseEvent 등의 다양한 타입도 존재하여 상황에 따라 
타입을 명확하게 선언하기 어렵다. 

실제 `const el: HTMLElement = document.querySelector('#root')` 적용해보면 
요소를 인식못하는 경우를 위해 `null | undefined` 를 추가하라고 나오기도하며, 
오히려 적용후에도 에러를 표기하는 경우가 꽤 많다. 

이러한 경우에는 타입을 고정되어 타입을 접미사형태로 사용해야한다. 
다만 해당 값이 변하지 않는다는 것을 확실하게 인지시키며, 이에 따른 내용은 사용한 개발자가 명확하게 통제한다는 의미도 가지고 있다. 

```typescript
const obj = {user: 'zido'} as const   
const arr = [1,3,'zero'] as const
const rootEl = document.getElementById('root') as HTMLElement
```

---
## 배열 / 튜플

### 배열 타입
위에서 언급한 배열형태를 이용하는 타입은 아래와 같다. 
``` typescript
const arr: string[] = ['1', '2', '3']
const arr2: Array<string> = ['1', '2', '3]
```

첫번째 방법은 `string` 형태의 배열을 나열하겠다는 의미
두번째 방법은 동일한 내용이지만 제네릭 표현

#### 하나이상의 타입을 사용시
``` typescript
const arr: (number | string)[] = ['1', '2', '3', 4, 5]
```

자바스크립트에서는 배열에 다양한 타입의 값을 자유롭게 넣을 수 있으나, 
타입스크립트의 경우 자유도를 제한하였기 때문에 이를 고민 해 볼 필요가 있다. 

- 실제 배열의 내용에는 대부분 같은 타입의 값을 넣어 사용하는 경우가 많다.
- 또는 짧은 배열을 사용 및 각 배열의 위치는 고정 타입으로 사용하는 경우가 많다. 


### 튜플타입
각 요소자리에 타입이 고정되어 있는 배열을 튜플(tuple) 이라고 부른다. 
``` typescript
const tuple: [number, boolean, string] = [1, false, 'hello']
```
위 형태로 사용하면 0,1,2 위치에 자리한 형태는 각 타입외에는 사용할 수 없다. 
다만 아래 다소 특이한 부분은 존재한다. 
``` typescript
const tuple: [number, boolean, string] = [1, false, 'hello']

tuple[3] = 'other-code'       // 언급하지 않은 타입형태이이므로 에러 (기본 undefined)
tuple.push('input-code')      // 삽입 가능 (push, pop, shift, unshift 모두 가능)


const tuple2: readonly [number, boolean, string] = [1, false, 'hello']
// readonly 수식어를 사용함으로인해 값 추가 불가능, 수정도 불가능하다. - 사용상 주의 필요
```

여러 타입을 섞어 사용하거나, 동일타입들을 담아야 하는 경우라면
``` typescript
const strBooks: [...string[]] = ['javascript','typescript', 'elm' ]
const strNumBool: [string, ...number[], boolean] = ['book', 1,2,3,4,54, false]
```

`...type[]` 표기형태가 특정 타입이 연달아 나올 수 있도록 표기한 형태 
이는 구조할당을 사용하는 경우에도 사용이 가능하다

``` typescript
const [a, ...rest]: [string ...number[]] = ['hello', 1,2,3,5,6,7,9]
```

타입 지정시 `?`옵션이 붙는 경우 없어도 가능한 표기방법(옵션)
``` typescript
const tuple: [number, boolean?, string?] = [1]
```


---
## 유니언 타입
타입선언시 하나의 타입만 사용하는 것이 아니라 여러 타입을 동시에 사용할 수 있다. 
실제로 `DOM`사용에서는 매우 흔한 상황으로 발생하게 된다.

``` typescript
const selectLink: HTMLElement | null = document.querySelector('.box')

let strNum: string | number = 'hello'
    strNum = 10
```

---
## 타입스크립트에만 존재하는 타입들
- any: 
	- 모든 타입을 대신하여 사용가능하나, 타입스크립트를 사용하는 주의미를 잃어버리므로 지양함
	- `JSON.parse`, `fetch` 함수에서는 any를 반환하므로 타입을 직접 지정하여 any처리 방지하는 것을 권장
- unknown: 
	- any와 비슷하게 모든 타입 대입가능하지만 이후 수행불가
	- `try{} catch(error){}` 에서 error 매개변수의 경우 `unknown`으로 추론됨
- void: 
	- 함수사용 시 반환값이 void인 경우 인 경우
	- 즉,`return false`의 개념으로 반환값이 undefined인 경우 사용
- {}, Object :
	- {}는 객체 X , null/undefined를 제외한 모든 값을 의미 (실사용시 에러표기됨)
	- {} 타입은 Object타입과 동일하며, 객체지만 객체만 대입가능하지 않음(Object 명의 `O` 대문자 사용)
	- 실제로는 사용할 수 없음 (내용 확인용)
- nerver : 
	- 어떠한 타입도 대입이 불가능한 타입-무한반복문이 들어간 함수의 반환값 
	- 반환타입이 void로 추론되는경우
	- Ts Config 에서 noImplicitAny 체크해재시 any[] 타입이 never[]로 변환


---
## 타입별칭 
틍정값을 지정하여 타입을 지정할 수 있다.
``` typescript
type A = string
const str: A = 'hello'
```
주로 가독성이 낮은 환경에서 타입을 별도로 지정하여 사용하는 경우가 많음 

``` typescript
// 타입 별도 정리
type ValueUnit = (value: number, unit: string) => string

// 함수사용시 정리된 타입을 적용
const func: ValueUnit = (value, unit)=> value + unit
```
가독성이 낮은 경우에 사용하거나, 동일한 타입을 반복사용하는 경우 재사용성을 위해서 많이 사용하는 편

---
## 인터페이스
타입을 별칭을 붙여 사용하는 방법 외에도 인터페이스를 사용하는 경우도 있다. 
각 속성들의 구분은 명확하게 표현되어 있지 않기에 기업 가이드에따라 일관성있게 사용하는 것을 권장

``` typescript
// 일반표현
interface Person {user: string, age: number, phone: number}


// 함수에서 사용가능 
interface Func {
	(x: number, y: nubmer): number
}

const add: Func = (x, y) => x+y

// 배열에서 사용가능: 개수 표현은 숫자로, 이외 항목값은 문자로 나열하겠다는 의미 
interface Arr{
	length: number
	[key: number]: string         
}
const arr: Arr = ['3', '5', '6']    
```

인터페이스는 여러번 동일이름으로 사용이 가능하며, 속성이 겹치는 경우 타입이 다르면 에러
다른 속성을 가지면 합쳐지는 현상 발생 
``` typescript

// 동일 속성, 다른타입을 가지므로 에러 
interface Merge { one: string }
interface Merge { one: number }


// 다른 속성을 가지므로 인터페이스결과는 합쳐짐
interface Merge { one: string }
interface Merge { two: string }


/* 
interface Merge { 
	one: string
	two: string 
	}

*/
```

> Warning: 
> 인터페이스의 병함에는 다른 개발자가 만든 인터페이스와 의도치 않게 병합되기도 하기에 주의 해야한다.

### 네임스페이스 
인터페이스 병합으로 인해 문제 발생하는 것을 막기 위해 `namespace`를 사용한다.

``` typescript
namespace Ex {
	interface Inner{
		test: string
	}
}

const ex1: Ex.Inner = { test: 'hello' }
```

>** type vs interface** 타입과 인터페이스의 구분이 다소 여러분 부분이 있다 상세한 확인이 필요

---
