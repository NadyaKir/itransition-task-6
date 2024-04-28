import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  canvasData: {
    type: String,
    default:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABJklEQVRYR+2WPU7DUBCGv3RAikkljJowQdRIGKoJFIoCOgKo4x6iiYNUJpFhIzBEYqZGkyB1Us5wLc+dIzCMe45nZvZvFHz7xN7PLwV+mPNNru1Sv4CeZm1TS1bZKuHoUyfFVwIi9WuI/lbvoiq2VV9VTU1N9ShzD1fV3q7X1tvf39nH9+jw4gmeP2s6+T6cEEDKjqoaC0tLSWAZ+fbVOrv6//frU01NRUpFhYUPF4gZa6M8YhSJVUJdHR2ovLi+PHz8ZFCxWW27WrF69Gu9SovKyclRUREa9fPt3W3t4eBgBx3d3fx8fFw4cPky1+5vra0NKCgoA9nzpyhlkG6tWrx5s1a5j58+bMmzdvN1vb29n6enaqqrr6+vqnMw1NbWhqakpR8fHyJ4KiKnp6eomXgr6+v6+vrP5+ft5eXlpaWk3rfz+dtLS0sbDwcFAoKiouIimfIvOzp07d+5c2ePj4yMjKycnJqXH4bG5u3t7e7q6unp6fWrVvz8/OQrVbr++vqV6sDHFxcWq1Wry8nJqbm3t7e3t6enh4eHhUVFTi4uL69evR0tKCsrKwAULFkRnZ2dUqVOnD9/PzQ0NC+vr6ioqLQqFFRUWpqaoKCwvr6+Uqk2DQ0Nvb29FycnKSkpLS0tLS0tAaUkmWlj6XR6TFAAAAAElFTkSuQmCC",
  },
});

const Board = mongoose.model("Board", boardSchema);

export default Board;
