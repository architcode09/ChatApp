import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/clerk-react";

function App() {
  return (
    <div>
      <h1>MY APP</h1>

      <header>
        <SignedOut>
          <SignInButton mode="modal"/>
          <SignUpButton mode="modal"/>
        </SignedOut>

        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>
    </div>
  );
}

export default App;
