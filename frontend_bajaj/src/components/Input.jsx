import { useState } from 'react';

export default function JsonForm() {
    const [jsonInput, setJsonInput] = useState('');
    const [error, setError] = useState(null);
    const [isJsonSubmitted, setIsJsonSubmitted] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [dropdownOptions, setDropdownOptions] = useState([]); // New state for dynamic options
    const [result, setResult] = useState(null); // New state for backend response

    const handleInputChange = (e) => {
        const value = e.target.value;
        setJsonInput(value);
        if (value.trim()) {
            try {
                JSON.parse(value);
                setError(null);
            } catch (err) {
                setError('Invalid JSON: ' + err.message);
            }
        } else {
            setError(null);
        }
    };

    const handleDropdownChange = (e) => {
        const selected = Array.from(e.target.selectedOptions, option => option.value);
        setSelectedOptions(selected);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const parsedJson = JSON.parse(jsonInput);
            const response = await fetch('http://localhost:5000/api/submit-json', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(parsedJson)
            });
            const data = await response.json();
            if (response.ok) {
                setIsJsonSubmitted(true);
                setDropdownOptions(data.dropdownOptions); // Set dropdown options from backend
                setJsonInput('');
                setError(null);
                alert(data.message);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Error submitting JSON: ' + err.message);
        }
    };

    // New function to submit dropdown selections
    const handleDropdownSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/submit-dropdown', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ selectedOptions })
            });
            const data = await response.json();
            if (response.ok) {
                setResult(data); // Store the processed result
                alert('Dropdown selections processed successfully!');
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Error submitting dropdown selections: ' + err.message);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="jsonInput">Enter JSON:</label>
                    <input
                        type="text"
                        id="jsonInput"
                        value={jsonInput}
                        onChange={handleInputChange}
                        placeholder='{"key": "value"}'
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontFamily: 'monospace',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>

                {error && (
                    <div style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!jsonInput.trim() || error}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: (!jsonInput.trim() || error) ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: (!jsonInput.trim() || error) ? 'not-allowed' : 'pointer'
                    }}
                >
                    Submit
                </button>
            </form>

            {isJsonSubmitted && (
                <div style={{ marginTop: '20px' }}>
                    <label htmlFor="multiSelect">Select Options:</label>
                    <select
                        id="multiSelect"
                        multiple
                        value={selectedOptions}
                        onChange={handleDropdownChange}
                        style={{ width: '100%', padding: '8px', height: '100px' }}
                    >
                        {dropdownOptions.map(option => (
                            <option key={option} value={option}>
                                {option.charAt(0).toUpperCase() + option.slice(1).replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                    <div style={{ marginTop: '10px' }}>
                        Selected: {selectedOptions.length > 0 ? selectedOptions.join(', ') : 'None'}
                    </div>
                    <button
                        onClick={handleDropdownSubmit}
                        disabled={selectedOptions.length === 0}
                        style={{
                            marginTop: '10px',
                            padding: '8px 16px',
                            backgroundColor: selectedOptions.length === 0 ? '#ccc' : '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: selectedOptions.length === 0 ? 'not-allowed' : 'pointer'
                        }}
                    >
                        Submit Selections
                    </button>
                </div>
            )}

            {result && (
                <div style={{ marginTop: '20px' }}>
                    <h3>Processed Result:</h3>
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}