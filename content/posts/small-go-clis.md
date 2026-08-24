---
title: Small Go CLIs still earn their keep
description: How a tiny Go command stays honest — flags, exit codes, and tests you can run in one file.
date: "2026-08-18"
type: go
tags: [cli, testing]
draft: true
---

Not every tool needs a framework. A Go command that does one job, fails loudly, and has a table test will outlive a generated scaffold.

Start with `flag` and a non-zero exit on bad input:

```go
package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	name := flag.String("name", "", "package to inspect")
	flag.Parse()

	if *name == "" {
		fmt.Fprintln(os.Stderr, "how: -name is required")
		os.Exit(2)
	}

	fmt.Println(*name)
}
```

Keep the logic in a function you can test without `os.Exit`:

```go
func run(name string) error {
	if name == "" {
		return fmt.Errorf("name is required")
	}
	return nil
}

func TestRun(t *testing.T) {
	if err := run(""); err == nil {
		t.Fatal("expected an error")
	}
}
```

Ship the binary. The note on How is the same idea: markdown in, static HTML out, no extra runtime.
