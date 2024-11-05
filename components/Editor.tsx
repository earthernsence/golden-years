"use client";

import "@blocknote/mantine/style.css";

import { useTheme } from "next-themes";

import {
  PartialBlock,
} from "@blocknote/core";

import { BlockNoteView, darkDefaultTheme, lightDefaultTheme, Theme } from "@blocknote/mantine";

import { useCreateBlockNote } from "@blocknote/react";

import { useEdgeStore } from "@/lib/edgestore";

interface EditorProps {
  // Interfaces are just like this. I don't know man
  // eslint-disable-next-line no-unused-vars
  onChange: (val: string) => void;
  initialContent?: string,
  editable?: boolean;
}

const gyLightEditor = {
  colors: {
    editor: {
      background: "#fff6e4",
      text: "#3f3f3f"
    },
    shadow: "#1a1a1a",
    sideMenu: "#bababa",
    highlights: lightDefaultTheme.colors!.highlights
  }
} satisfies Theme;

const gyDarkEditor = {
  ...gyLightEditor,
  colors: {
    ...gyLightEditor.colors,
    editor: {
      background: "#2f2f2f",
      text: "#cfcfcf"
    },
    sideMenu: "#ffffff",
    highlights: darkDefaultTheme.colors!.highlights,
  }
} satisfies Theme;

const gyEditor = {
  light: gyLightEditor,
  dark: gyDarkEditor,
};

const Editor = ({
  onChange,
  initialContent,
  editable
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();

  const handleUpload = async(file: File) => {
    const res = await edgestore.publicFiles.upload({ file });
    return res.url;
  };

  const editor = useCreateBlockNote({
    initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
    uploadFile: handleUpload
  });

  const updateEditor = () => {
    if (editable) {
      onChange(JSON.stringify(editor.document, null, 2));
    }
  };

  // For some reason, BlockNoteView gives a ton of errors for the editor, editable, and onChange properties.
  // Unsure as to why -- as everything works as intended in spite of the error -- so not sure what's going on there.
  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "light" ? gyEditor.light : gyEditor.dark}
        editable={editable}
        onChange={updateEditor}
      />
    </div>
  );
};

export default Editor;