import { useEffect, useState } from 'react';
import { getMonthName } from '../utils/calendarHelpers';

type NotesSectionProps = {
  startDate: Date | null;
  endDate: Date | null;
  selectedMonth: number;
  selectedYear: number;
  activeDate: Date | null;
};

type NotesMap = Record<string, string>;

type NoteType = 'month' | 'range' | 'date';

const NotesSection = ({ startDate, endDate, selectedMonth, selectedYear, activeDate }: NotesSectionProps) => {
  const [notes, setNotes] = useState<NotesMap>({});
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<NoteType>('month');
  const [selectedDateNote, setSelectedDateNote] = useState<Date | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedNotes = window.localStorage.getItem('calendarNotes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem('calendarNotes', JSON.stringify(notes));
  }, [notes]);

  const getNoteKey = (): string | null => {
    if (noteType === 'month') {
      return `month-${selectedYear}-${selectedMonth}`;
    }
    if (noteType === 'range' && startDate && endDate) {
      return `range-${startDate.toDateString()}-${endDate.toDateString()}`;
    }
    if (noteType === 'date' && selectedDateNote) {
      return `date-${selectedDateNote.toDateString()}`;
    }
    return null;
  };

  const loadNote = () => {
    const key = getNoteKey();
    if (key && notes[key]) {
      setCurrentNote(notes[key]);
    } else {
      setCurrentNote('');
    }
  };

  useEffect(() => {
    loadNote();
  }, [noteType, selectedMonth, selectedYear, startDate, endDate, selectedDateNote, notes]);

  useEffect(() => {
    if (noteType !== 'date') return;
    if (!activeDate) return;
    setSelectedDateNote(activeDate);
  }, [activeDate, noteType]);

  const saveNote = () => {
    const key = getNoteKey();
    if (key) {
      setNotes({
        ...notes,
        [key]: currentNote,
      });
      setIsEditing(false);
    }
  };

  const deleteNote = () => {
    const key = getNoteKey();
    if (key) {
      const newNotes = { ...notes };
      delete newNotes[key];
      setNotes(newNotes);
      setCurrentNote('');
      setIsEditing(false);
    }
  };

  const getNoteDescription = () => {
    if (noteType === 'month') {
      return `Notes for ${getMonthName(selectedMonth, 'long')} ${selectedYear}`;
    }
    if (noteType === 'range' && startDate && endDate) {
      return `Notes for ${startDate.toDateString()} - ${endDate.toDateString()}`;
    }
    if (noteType === 'date' && selectedDateNote) {
      return `Notes for ${selectedDateNote.toDateString()}`;
    }
    if (noteType === 'date') {
      return 'Click a date on the calendar to attach notes.';
    }
    return 'Select a note type above';
  };

  const quickNotes = [
    'Meeting at 2 PM',
    'Birthday party',
    'Doctor appointment',
    'Deadline',
    'Vacation',
    'Pay bills',
    'Call family',
    'Gym day',
  ];

  const addQuickNote = (note: string) => {
    const newNote = currentNote ? `${currentNote}\n- ${note}` : `- ${note}`;
    setCurrentNote(newNote);
  };

  return (
    <div className="notes-section">
      <div className="notes-header">
        <h3>Notes and Reminders</h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="edit-notes-button"
          type="button"
        >
          {isEditing ? 'Cancel' : 'Edit'}
        </button>
      </div>

      <div className="note-type-selector">
        <button
          onClick={() => setNoteType('month')}
          className={`note-type-button ${noteType === 'month' ? 'active' : ''}`}
          type="button"
        >
          Monthly Notes
        </button>
        <button
          onClick={() => setNoteType('range')}
          className={`note-type-button ${noteType === 'range' ? 'active' : ''}`}
          disabled={!startDate || !endDate}
          type="button"
        >
          Date Range Notes
        </button>
        <button
          onClick={() => {
            setNoteType('date');
            if (activeDate) {
              setSelectedDateNote(activeDate);
              return;
            }
            const dateInput = window.prompt('Enter date (YYYY-MM-DD):');
            if (!dateInput) return;
            const [year, month, day] = dateInput.split('-').map(Number);
            if (year && month && day) {
              setSelectedDateNote(new Date(year, month - 1, day));
            }
          }}
          className={`note-type-button ${noteType === 'date' ? 'active' : ''}`}
          type="button"
        >
          Specific Date
        </button>
      </div>

      <div className="note-description">
        {getNoteDescription()}
      </div>

      {isEditing ? (
        <div className="note-editor">
          <textarea
            value={currentNote}
            onChange={(event) => setCurrentNote(event.target.value)}
            placeholder="Write your notes here..."
            rows={6}
            className="note-textarea"
          />

          <div className="quick-notes">
            <p>Quick add:</p>
            <div className="quick-notes-grid">
              {quickNotes.map((note) => (
                <button
                  key={note}
                  onClick={() => addQuickNote(note)}
                  className="quick-note-button"
                  type="button"
                >
                  {note}
                </button>
              ))}
            </div>
          </div>

          <div className="note-actions">
            <button onClick={saveNote} className="save-note-button" type="button">
              Save Note
            </button>
            <button onClick={deleteNote} className="delete-note-button" type="button">
              Delete Note
            </button>
          </div>
        </div>
      ) : (
        <div className="note-display">
          {currentNote ? (
            <div className="note-content">
              <pre>{currentNote}</pre>
            </div>
          ) : (
            <div className="no-note">
              <p>
                {noteType === 'date'
                  ? 'No notes saved for this date.'
                  : 'No notes saved for this selection.'}
              </p>
              <p className="hint">
                {noteType === 'date'
                  ? 'Pick a date on the calendar, then click "Edit".'
                  : 'Click "Edit" to add a note.'}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="notes-info">
        <small>Notes are automatically saved to your browser.</small>
      </div>
    </div>
  );
};

export default NotesSection;
