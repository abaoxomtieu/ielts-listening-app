import React, { useState, useEffect } from 'react';
import { FormSection, FormField } from '../../CompletionForm';
import { TableCompletionContent, TableRow } from '@/lib/dtos/completion';
import TableCompletion from '@/components/completion/TableCompletion';
import VisualBlankEditor from '../../VisualBlankEditor';

interface Props {
    initialContent?: any;
    onContentChange: (content: any, answerKey: any) => void;
    questionNumber: number;
}

export default function TableCompletionBuilder({ initialContent, onContentChange, questionNumber }: Props) {
    const [questionText, setQuestionText] = useState(initialContent?.questionText || 'Complete the table below.');
    const [headers, setHeaders] = useState<string[]>(initialContent?.table?.headers || ['Col 1', 'Col 2', 'Col 3']);
    const [rows, setRows] = useState<TableRow[]>(initialContent?.table?.rows || []);

    useEffect(() => {
        const answerKey: Record<string, string> = {};
        let qCounter = questionNumber;

        const formattedRows = rows.map(row => ({
            ...row,
            id: row.id || Date.now(),
            cells: row.cells.map(cell => {
                if (cell.value.includes('[______]')) {
                    if (!cell.isEditable) cell.isEditable = true;
                    answerKey[String(qCounter)] = cell.answer || '';
                }
                return cell;
            })
        }));

        let keyIndex = questionNumber;
        formattedRows.forEach(row => {
            row.cells.forEach(cell => {
                if (cell.isEditable) {
                    answerKey[String(keyIndex)] = cell.answer || '';
                    keyIndex++;
                }
            })
        })


        const content: TableCompletionContent = {
            questionText,
            instructions: 'ONE WORD AND/OR A NUMBER',
            table: {
                headers: headers,
                rows: formattedRows
            },
            wordLimit: 'ONE WORD AND/OR A NUMBER',
            audioTimeRange: { start: '00:00', end: '00:00' },
            media: { image: null, audio: '/audio/section4.mp3' },
            uiHints: { displayType: 'table' }
        };

        onContentChange(content, answerKey);
    }, [questionText, headers, rows, questionNumber]);

    const updateHeaders = (val: string) => {
        setHeaders(val.split(',').map(s => s.trim()));
    }

    const addRow = () => {
        setRows([...rows, {
            id: Date.now(),
            cells: headers.map(() => ({ value: 'Text', isEditable: false, answer: '' }))
        }]);
    };

    const updateCell = (rowIdx: number, cellIdx: number, updates: any) => {
        const newRows = [...rows];
        const currentCell = { ...newRows[rowIdx].cells[cellIdx], ...updates };

        if (updates.value !== undefined) {
            if (updates.value.includes('[______]')) {
                currentCell.isEditable = true;
            } else {
                currentCell.isEditable = false;
            }
        }

        newRows[rowIdx].cells[cellIdx] = currentCell;
        setRows(newRows);
    };

    const removeRow = (idx: number) => {
        setRows(rows.filter((_, i) => i !== idx));
    }


    return (
        <div className="space-y-6">
            <FormSection title="Table Settings (Common)" collapsible={false}>
                <FormField label="Question Text" value={questionText} onChange={setQuestionText} />
                <FormField label="Headers (comma separated)" value={headers.join(', ')} onChange={updateHeaders} />
            </FormSection>

            <FormSection title="Table Rows">
                {rows.map((row, rIdx) => (
                    <div key={row.id} className="mb-4 p-4 border rounded bg-gray-50 text-black relative">
                        <button onClick={() => removeRow(rIdx)} className="absolute top-2 right-2 text-red-500 text-sm">Remove Row</button>
                        <div className="font-bold mb-2">Row {rIdx + 1}</div>
                        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${headers.length}, 1fr)` }}>
                            {row.cells.map((cell, cIdx) => (
                                <div key={cIdx} className="bg-white p-2 rounded border">
                                    <div className="text-xs text-gray-500 mb-1">{headers[cIdx]}</div>
                                    <VisualBlankEditor
                                        className="mb-1"
                                        value={cell.value}
                                        onChange={(val) => updateCell(rIdx, cIdx, { value: val })}
                                        placeholder="Value or add blank"
                                    />
                                    {cell.isEditable && (
                                        <input
                                            className="w-full border border-blue-300 px-1 bg-blue-50"
                                            placeholder="Answer"
                                            value={cell.answer}
                                            onChange={(e) => updateCell(rIdx, cIdx, { answer: e.target.value })}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
                <button onClick={addRow} className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500">+ Add Row</button>
            </FormSection>
        </div>
    );
}
