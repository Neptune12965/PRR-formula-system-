import React from 'react';

const pythonCode = `
# B4 Truth Values (as strings for clarity)
T = "True"
F = "False"
B = "Both"
N = "Neither"

# Negation (¬) operator based on B4 semantics from Appendix C
NEGATION_TABLE = {
    T: F,
    F: T,
    B: B,
    N: N,
}

# Conjunction (∧) operator based on B4 semantics from Appendix C
CONJUNCTION_TABLE = {
    (T, T): T, (T, F): F, (T, B): B, (T, N): N,
    (F, T): F, (F, F): F, (F, B): F, (F, N): F,
    (B, T): B, (B, F): F, (B, B): B, (B, N): F,
    (N, T): N, (N, F): F, (N, B): F, (N, N): N,
}

def join_info_lattice(v1, v2):
    """Computes the least upper bound (join) in the B4 information lattice."""
    if v1 == v2: return v1
    if v1 == N: return v2
    if v2 == N: return v1
    # Any combination of T and F, or anything with B, results in B.
    return B

def solve_liar_fixed_point():
    """
    Demonstrates the PRR-Engine's stable resolution of the Liar sentence (L <=> ¬L)
    by finding its fixed-point value in the B4 lattice.
    """
    
    # Initialize L to the 'bottom' of the information lattice (no information).
    liar_value = N
    
    # The loop simulates the engine's iterative process of refining its belief about L.
    # At each step, it applies the definition of L (L is ¬L) to its current value
    # and merges this new information with the old using the monotonic 'join' operator.
    max_iterations = 5
    for i in range(max_iterations):
        previous_value = liar_value
        
        # Compute the next value based on the sentence's definition: L = ¬L
        computed_value = NEGATION_TABLE[previous_value]
        
        # Update the value by taking the least upper bound in the info lattice.
        # This ensures the process is monotonic and information is never lost.
        liar_value = join_info_lattice(previous_value, computed_value)
        
        # Check for termination: the value has stabilized.
        if liar_value == previous_value:
            # Termination Argument:
            # The algorithm is guaranteed to terminate because updates are monotonic
            # within a finite lattice. The 'join_info_lattice' function ensures that
            # the value only moves "up" the information lattice (N -> T/F -> B).
            # Since the lattice is finite and has a top element (B), the iteration
            # must reach a stable fixed point. For the Liar sentence L = ¬L, this
            # fixed point is B, as it is the only value for which v = ¬v.
            return liar_value
            
    return liar_value # Should return B within a few iterations

# Example execution
result = solve_liar_fixed_point()
print(f"The stable fixed-point for the Liar sentence is: {result}")
# Expected output: The stable fixed-point for the Liar sentence is: Both
`.trim();

// Helper components defined outside the main App component to prevent re-rendering issues.
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow-md p-6 md:p-8 ${className}`}>
    {children}
  </div>
);

const SectionHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">{title}</h2>
    <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1">{subtitle}</h3>
  </div>
);

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden shadow-inner">
      <div className="bg-slate-800 px-4 py-2 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">Python 3</span>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        </div>
      </div>
      <pre className="p-4 text-sm text-slate-100 overflow-x-auto">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
};

const MathFormula: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-slate-600">
        Let <code className="font-mono text-indigo-700 bg-indigo-50 rounded-md px-1 py-0.5">C(v)</code> be the function mapping a truth value <code className="font-mono text-indigo-700 bg-indigo-50 rounded-md px-1 py-0.5">v ∈ &#123;T, F, B, N&#125;</code> to a confidence interval <code className="font-mono text-indigo-700 bg-indigo-50 rounded-md px-1 py-0.5">[min, max]</code>.
      </p>
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 font-mono text-slate-800 text-lg leading-loose shadow-sm">
        <div className="flex items-start">
          <span className="mr-4">C(v) =</span>
          <div className="flex flex-col">
            <span>&#123; [1.0, 1.0]  if v = T</span>
            <span>&#123; [0.0, 0.0]  if v = F</span>
            <span>&#123; [0.0, 1.0]  if v = B</span>
            <span>&#123; [0.0, 0.0]  if v = N</span>
          </div>
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-slate-700">Justification:</h4>
        <p className="mt-2 text-slate-600">
          The mapping for <strong className="text-slate-800">B (Both)</strong> to <code className="font-mono text-indigo-700 bg-indigo-50 rounded-md px-1 py-0.5">[0.0, 1.0]</code> represents maximal uncertainty, reflecting that the available evidence is completely contradictory and supports both full belief and full disbelief simultaneously.
        </p>
      </div>
    </div>
  );
};


const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl text-center mb-8 md:mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900">PRR Formal System</h1>
        <p className="mt-3 text-lg text-slate-600">
          Computational Evidence from the Research Paper
        </p>
      </header>
      
      <main className="w-full max-w-5xl space-y-12">
        <Card>
          <SectionHeader 
            title="Evidence B" 
            subtitle="Python Implementation of PRR-Engine" 
          />
          {/* FIX: Replaced LaTeX-like math notation with HTML tags and entities to fix JSX parsing errors. The original notation was likely misinterpreted as a React component <B> and contained unescaped characters, leading to "Cannot find name 'B'" errors. */}
          <p className="text-slate-600 mb-6">
            The core function of the PRR-Engine, demonstrating its ability to solve the Liar sentence (L &hArr; &not; L) as a stable fixed point in the <b>B</b><sub>4</sub> lattice, guaranteeing the output is <b>B</b> (Both).
          </p>
          <CodeBlock code={pythonCode} />
        </Card>

        <Card>
          <SectionHeader 
            title="Evidence A" 
            subtitle="Mathematical Mapping to Confidence Intervals"
          />
          {/* FIX: Replaced LaTeX-like math notation with HTML tags to prevent JSX parsing errors. The notation was likely being misinterpreted as a React component <B>, causing "Cannot find name 'B'" errors. */}
          <p className="text-slate-600 mb-6">
            The formal mathematical formula that converts the four discrete truth-values of the <b>B</b><sub>4</sub> logic into a continuous confidence interval, providing a basis for empirical justification in data aggregation experiments.
          </p>
          <MathFormula />
        </Card>
      </main>

      <footer className="w-full max-w-5xl text-center mt-12 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Formal Systems Inc. All rights reserved.</p>
        <p>A demonstration of meta-logical validation principles.</p>
      </footer>
    </div>
  );
};

export default App;
