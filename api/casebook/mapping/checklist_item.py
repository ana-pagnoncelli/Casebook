from casebook.domain.checklist_item import ChecklistItem
from casebook.persistence.checklist_item import ChecklistItemRow


def checklist_item_from_row(row: ChecklistItemRow) -> ChecklistItem:
    return ChecklistItem(id=row.id, text=row.text, completed=row.completed)


def apply_checklist_item(row: ChecklistItemRow, item: ChecklistItem) -> None:
    row.text = item.text
    row.completed = item.completed
