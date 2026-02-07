import { IELTSListeningQuestion, TestInfo, TestSection } from '@/types';

export interface FullTestData {
    info: TestInfo;
    sections: TestSection[];
}

export interface SaveTestRequest {
    filename: string;
    data: FullTestData;
}
