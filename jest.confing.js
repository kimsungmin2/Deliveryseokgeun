export default {
    // 해당 패턴에 일치하는 경로가 존재할 경우 테스트를 하지 않고 넘어갑니다.
    testPathIgnorePatterns : ['/node_modules/'],    // <- 테스트코드 실행시 저 폴더는 건너뜀
    // 테스트 실행 시 각 TestCase에 대한 출력을 해줍니다.
    verbose: true,  // 테스트코드 내부의 세부사항 까지 출력 되도록 설정
}